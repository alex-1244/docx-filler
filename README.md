# Docx Template Filler

Client-side React app for filling `.docx` templates. Upload a Word document with `{{ placeholder }}` syntax, fill in values via auto-generated form fields, and download the completed file. Dockerized for ARM/Raspberry Pi deployment.

## Features

- Drag & drop `.docx` upload
- Auto-detects `{{ placeholder }}` tags in document body, headers, and footers
- Generates a form with labeled inputs for each placeholder
- Downloads the filled document as a `.docx` file
- Fully client-side — no data leaves the browser

## Quick Start

```bash
npm install
npm run dev
```

## Docker (ARM / Raspberry Pi)

```bash
# Build for ARM
docker buildx build --platform linux/arm64 -t docx-filler:latest .

# Run
docker run -d -p 8080:80 --restart unless-stopped docx-filler:latest
```

## Tech Stack

- React 18 + Vite
- Tailwind CSS
- docxtemplater + PizZip
- nginx (production serving)

## License

[MIT](LICENSE)
