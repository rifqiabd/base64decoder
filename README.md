# Base64 Image Decoder

## Description
Base64 Image Decoder is a simple tool to decode Base64 encoded images. It is useful for decoding image data that has been encoded to ensure safe transmission over text-based protocols.

## Installation
To install the Base64 Image Decoder, clone the repository and install the necessary dependencies.

```bash
git clone https://github.com/yourusername/base64decoder.git
cd base64decoder
npm install
```

## Usage
To use the Base64 Image Decoder, run the following command:

```bash
node decode.js <base64string> <outputfile>
```

Replace `<base64string>` with the Base64 encoded string of the image you want to decode and `<outputfile>` with the path where you want to save the decoded image.

Example:

```bash
node decode.js iVBORw0KGgoAAAANSUhEUgAAAAUA... output.png
```

This will save the decoded image as `output.png`.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
