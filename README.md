<a id="readme-top"></a>
<br />
<div align="center">
  <h3 align="center">MeasurAI</h3>

  <p align="center">
    The MeasurAI web API documentation.
  </p>
</div>

## About
<p>
    A nice web API to manage water and gas consume, powered by <a href="https://ai.google.dev/gemini-api/docs/vision">Gemini AI</a>.
</p>

## Getting Started

Below you'll find instructions about how setting up and use this web API.

### Prerequisites

Here are some packages you need to have installed on your PC:

* [nodejs](https://nodejs.org/en), [npm](https://docs.npmjs.com/cli/v10/configuring-npm/install) 

* [docker](https://docs.docker.com/get-docker/)

And you'll need a Gemini API key. If you don't have one, see in <a href="https://aistudio.google.com/app/apikey">this link</a> how to get. Once you have an API key, create a `.env` in this repository root and put it there:

```ts
// .env
GEMINI_API_KEY=your_key
```

### Installation

1. Clone this repo
   ```sh
   git clone https://github.com/OsmanRodrigues/tech-challenge-shopper.git
   ```
2. Run with `docker`
   ```sh
   docker compose up --build
   ```
3. Run in `dev` mode
   1. Install NPM packages
   ```sh
   npm install
   ```
   2. Run 
   ```sh
   npm run dev
   ```
4. Build and run
   1. Build
   ```sh
   npm run build
   ```
   2. Run the build
   ```sh
   npm start
   ```
5. Run tests
   ```sh
   npm run test
   ```

## Usage

Here you can access the examples of web API communication and resources consume.

Once the steps taken for installation have been successful, the web API should be available in http://localhost:5000/ - for`dev` and `build` steps OR http://localhost:80/ - for `docker` steps.

There are these resources available:

* #### [POST]/upload
  ```ts
    description — register a measure.
    request data — {
        image: base64 string
        customer_code: string
        measure_datetime: ISO datetime string
        measure_type: "WATER" | "GAS" 
    } 
  ```
  Response data
  ```ts
    STATUS CODE - 200
    {
        image_url: http url string
        measure_value: number
        measure_uuid: UUID string
    } 
  ```
  Invalid data exception response
  ```ts
    STATUS CODE - 400
    {
        error_code: "INVALID_DATA"
        error_description: "Os dados fornecidos no corpo da requisição são inválidos"
    } 
  ```
  Double report exception response
  ```ts
    STATUS CODE - 409
    {
        error_code: "DOUBLE_REPORT"
        error_description: "Já existe uma leitura para este tipo no mês atual"
    }  
  ```

## License
MeasurAI is released under the MIT License.

## Acknowledgments
MeasurAI is the work resulted during the tech challenge of [Shopper](https://www.linkedin.com/company/shopper.com.br/) hiring process. I would like to express my gratitude to the developers and hire collaboratos that developed this challenge, because I learned amazing things with it. 🙏