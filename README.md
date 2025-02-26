# Base64 Image Decoder

A web-based tool for decoding and processing Base64-encoded images from various sources, including fetch statements.

## Features
🖼️ Decode Base64 images from various formats  
🔍 Automatically extract Base64 data from fetch statements  
📦 Batch process multiple images at once  
📄 Generate PDF documents from decoded images  
💾 Download individual images or create ZIP archives  
🔧 Server-side image processing for reliability  

## Description
Base64 Image Decoder is a web application built with Next.js that allows you to decode Base64-encoded images. It supports extracting Base64 data from multiple sources, including raw Base64 strings, data URLs, and even fetch API statements. This is particularly useful for developers who need to extract embedded images from code or API responses.

## Installation
To install the Base64 Image Decoder, clone the repository and install the necessary dependencies.

```bash
git clone https://github.com/yourusername/base64decoder.git
cd base64decoder
npm install
```

## Usage
Open the application in your browser (default: http://localhost:3000)
Paste your Base64-encoded image data in the input field
Click "Decode" to process the input
View and manage your decoded images:
- Select images using checkboxes
- Download individual images
- Download selected images as a ZIP archive
- Generate a PDF containing all images
- Delete unwanted images

## Supported Input Formats
- Raw Base64 strings: /9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA...
- Data URLs: data:image/jpeg;base64,/9j/4AAQSkZJRgABA...
- Fetch statements: 
  ```javascript
  fetch("data:image/jpeg;base64,/9j/4AAQSkZJRgABA...", {
    "method": "GET"
  });
  ```

## Tech Stack
- Next.js 14
- React
- TypeScript
- Tailwind CSS
- pdf-lib (server-side PDF generation)

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any changes or improvements.
