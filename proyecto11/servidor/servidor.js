import { createServer } from 'http';
import cors from 'cors';

// JSON data to serve
const data = [
    {
        "titulo": "Introduction to Web Development",
        "texto": "Web development is the process of creating websites and web applications. It involves various technologies like HTML, CSS, and JavaScript."
    },
    {
        "titulo": "The Importance of SEO",
        "texto": "Search Engine Optimization (SEO) is crucial for improving the visibility of your website on search engines. It involves optimizing content, keywords, and meta tags."
    },
    {
        "titulo": "Understanding Responsive Design",
        "texto": "Responsive design ensures that your website looks good on all devices, from desktops to smartphones. It uses flexible layouts and media queries."
    },
    {
        "titulo": "Getting Started with JavaScript",
        "texto": "JavaScript is a versatile programming language that adds interactivity to websites. It can be used for both front-end and back-end development."
    }
];

// Create an HTTP server
const server = createServer((req, res) => {
    // Enable CORS
    cors()(req, res, () => {
        if (req.method === 'GET' && req.url === '/data') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
        }
    });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
