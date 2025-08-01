# CLUSTER AI

CLUSTER AI is a web-based AI chatbot application built using HTML, CSS, and JavaScript. It leverages the Hugging Face API with the powerful `mistralai/Mistral-7B-Instruct-v0.3` model to provide intelligent and interactive conversational experiences.

## Features

- AI-powered chatbot interface
- Utilizes the Mistral-7B-Instruct model from Hugging Face for natural language understanding and generation
- Simple and responsive web design using HTML, CSS, and JavaScript
- Easy integration with Hugging Face API for seamless AI interactions

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Hugging Face Inference API
- Mistral-7B-Instruct-v0.3 model by mistralai

## Getting Started

### Prerequisites

- A Hugging Face account
- An API token from Hugging Face (You can get one from https://huggingface.co/settings/tokens)

### Installation

1. Clone or download this repository to your local machine.
2. Open the project folder in your preferred code editor.
3. Update the JavaScript code to include your Hugging Face API token for authentication.

### Usage

1. Open the `index.html` file in a web browser.
2. Interact with the chatbot by typing your messages.
3. The chatbot sends your input to the Hugging Face API using the `mistralai/Mistral-7B-Instruct-v0.3` model and displays the AI-generated responses.

## API Integration

The chatbot communicates with the Hugging Face Inference API endpoint for the `mistralai/Mistral-7B-Instruct-v0.3` model. Make sure to include your API token in the request headers for authentication.

Example API request header:

```
Authorization: Bearer YOUR_HUGGINGFACE_API_TOKEN
```

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to improve the project.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributors

- **Main Developer:** [Balagopal C Nair](https://github.com/Balagopalcnair)  
- **Collaborator:** [Aravind Lal](https://github.com/mfscpayload-690)

## Acknowledgments

- [Hugging Face](https://huggingface.co/) for providing the API and models
- [Mistral AI](https://huggingface.co/mistralai) for the Mistral-7B-Instruct model
