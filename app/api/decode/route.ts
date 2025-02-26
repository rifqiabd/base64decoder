import { NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { base64Data, generatePdf } = body;
    
    if (!base64Data || typeof base64Data !== 'string') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // Process the input to handle various formats
    let processedInputs: string[] = [];
    
    // Check if input contains fetch statements
    const fetchRegex = /fetch\s*\(\s*["']data:image\/[^;]+;base64,([^"']+)["']/g;
    let fetchMatch;
    let fetchFound = false;
    
    // Extract all fetch statements
    while ((fetchMatch = fetchRegex.exec(base64Data)) !== null) {
      fetchFound = true;
      console.log("Detected fetch statement, extracting base64 data");
      processedInputs.push(fetchMatch[1]);
    }
    
    // If no fetch statements were found, use the original input
    if (!fetchFound) {
      processedInputs = [base64Data];
    }
    
    // Process all inputs
    const allBase64Strings: string[] = [];
    
    for (const input of processedInputs) {
      // Split each input by lines
      const base64Strings = input
        .split(/\r?\n/)
        .map(str => str.trim())
        .filter(str => str.length > 0);
        
      allBase64Strings.push(...base64Strings);
    }

    if (allBase64Strings.length === 0) {
      return NextResponse.json({ images: [] });
    }
    
    // Process each base64 string
    const decodedImages = allBase64Strings.map(str => {
      // Check if the string already has a data URL format
      if (str.startsWith('data:image')) {
        return str;
      }
      
      // Extract base64 part if it's in a data URL format string
      const dataUrlRegex = /data:image\/[^;]+;base64,([^"'\s]+)/;
      const dataUrlMatch = str.match(dataUrlRegex);
      if (dataUrlMatch && dataUrlMatch[1]) {
        str = dataUrlMatch[1];
      }
      
      // Remove any prefixes that might be present (like "base64,")
      let cleanBase64 = str;
      if (cleanBase64.includes('base64,')) {
        cleanBase64 = cleanBase64.split('base64,')[1];
      }
      
      // Try to detect image format from base64 header or default to JPEG
      let imageFormat = 'jpeg';
      
      // Common base64 image header patterns
      if (cleanBase64.startsWith('/9j/')) {
        imageFormat = 'jpeg';
      } else if (cleanBase64.startsWith('iVBOR')) {
        imageFormat = 'png';
      } else if (cleanBase64.startsWith('R0lGOD')) {
        imageFormat = 'gif';
      } else if (cleanBase64.startsWith('UklGR')) {
        imageFormat = 'webp';
      }
      
      // Return data URL
      return `data:image/${imageFormat};base64,${cleanBase64}`;
    });

    console.log(`Processed ${decodedImages.length} images on the server`);
    
    // Generate PDF if requested
    let pdfBase64 = null;
    if (generatePdf || body.images) {
      console.log('Starting PDF generation on server...');
      const pdfDoc = await PDFDocument.create();
      
      // Use provided images array if available, otherwise use decoded images
      const imagesToProcess = body.images || decodedImages;
      
      for (let i = 0; i < imagesToProcess.length; i++) {
        console.log(`Adding image ${i + 1}/${imagesToProcess.length} to PDF`);
        
        const dataUrl = imagesToProcess[i];
        const imageFormat = dataUrl.split(';')[0].split('/')[1];
        const base64Data = dataUrl.split(',')[1];
        
        // Convert base64 to Uint8Array
        const binaryData = Buffer.from(base64Data, 'base64');
        
        // Add a new page
        const page = pdfDoc.addPage([600, 800]);
        
        let image;
        try {
          // Embed the image based on its format
          if (imageFormat === 'jpeg' || imageFormat === 'jpg') {
            image = await pdfDoc.embedJpg(binaryData);
            console.log(`Embedded JPEG image ${i + 1}`);
          } else if (imageFormat === 'png') {
            image = await pdfDoc.embedPng(binaryData);
            console.log(`Embedded PNG image ${i + 1}`);
          } else {
            console.log(`Unsupported image format for PDF: ${imageFormat}, skipping...`);
            continue;
          }
          
          // Calculate dimensions to fit the page
          const { width, height } = image.scale(1);
          const maxWidth = 500;
          const maxHeight = 700;
          
          let scaleFactor = 1;
          if (width > maxWidth) {
            scaleFactor = maxWidth / width;
          }
          if (height * scaleFactor > maxHeight) {
            scaleFactor = maxHeight / height;
          }
          
          // Draw the image
          page.drawImage(image, {
            x: 50,
            y: page.getHeight() - (height * scaleFactor) - 50,
            width: width * scaleFactor,
            height: height * scaleFactor,
          });
          
          console.log(`Added image ${i + 1} to PDF with scale factor ${scaleFactor.toFixed(2)}`);
        } catch (error) {
          console.error(`Error embedding image ${i + 1}:`, error);
        }
      }
      
      // Serialize the PDF to bytes
      console.log('Finalizing PDF...');
      const pdfBytes = await pdfDoc.save();
      console.log(`PDF generated successfully! Size: ${(pdfBytes.length / 1024).toFixed(2)} KB`);
      
      // Convert to base64
      pdfBase64 = Buffer.from(pdfBytes).toString('base64');
    }
    
    // Return both the images and the PDF if generated
    return NextResponse.json({ 
      images: decodedImages,
      pdf: pdfBase64
    });
    
  } catch (error) {
    console.error('Error processing data:', error);
    return NextResponse.json(
      { error: 'Failed to process data' },
      { status: 500 }
    );
  }
}

// Add a new endpoint specifically for PDF generation
export async function PUT(request: Request) {
  try {
    const { images } = await request.json();
    
    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json({ error: 'Invalid or empty images array' }, { status: 400 });
    }
    
    console.log(`Generating PDF for ${images.length} images on server...`);
    const pdfDoc = await PDFDocument.create();
    
    for (let i = 0; i < images.length; i++) {
      console.log(`Adding image ${i + 1}/${images.length} to PDF`);
      
      const dataUrl = images[i];
      const imageFormat = dataUrl.split(';')[0].split('/')[1];
      const base64Data = dataUrl.split(',')[1];
      
      // Convert base64 to Uint8Array
      const binaryData = Buffer.from(base64Data, 'base64');
      
      // Add a new page
      const page = pdfDoc.addPage([600, 800]);
      
      try {
        // Embed the image based on its format
        let image;
        if (imageFormat === 'jpeg' || imageFormat === 'jpg') {
          image = await pdfDoc.embedJpg(binaryData);
          console.log(`Embedded JPEG image ${i + 1}`);
        } else if (imageFormat === 'png') {
          image = await pdfDoc.embedPng(binaryData);
          console.log(`Embedded PNG image ${i + 1}`);
        } else {
          console.log(`Unsupported image format for PDF: ${imageFormat}, skipping...`);
          continue;
        }
        
        // Calculate dimensions to fit the page
        const { width, height } = image.scale(1);
        const maxWidth = 500;
        const maxHeight = 700;
        
        let scaleFactor = 1;
        if (width > maxWidth) {
          scaleFactor = maxWidth / width;
        }
        if (height * scaleFactor > maxHeight) {
          scaleFactor = maxHeight / height;
        }
        
        // Draw the image
        page.drawImage(image, {
          x: 50,
          y: page.getHeight() - (height * scaleFactor) - 50,
          width: width * scaleFactor,
          height: height * scaleFactor,
        });
        
        console.log(`Added image ${i + 1} to PDF with scale factor ${scaleFactor.toFixed(2)}`);
      } catch (error) {
        console.error(`Error embedding image ${i + 1}:`, error);
      }
    }
    
    // Serialize the PDF to bytes
    console.log('Finalizing PDF...');
    const pdfBytes = await pdfDoc.save();
    console.log(`PDF generated successfully! Size: ${(pdfBytes.length / 1024).toFixed(2)} KB`);
    
    // Return the PDF as base64
    return NextResponse.json({ 
      pdf: Buffer.from(pdfBytes).toString('base64') 
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}