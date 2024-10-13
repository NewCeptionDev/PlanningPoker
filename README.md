<p align="center">
<img src="./frontend/public/logo_large.png" alt="Logo" height="200"/>
</p>

<div align="center">

# Planning Poker

</div>

Do you need a simple Webpage to play Planning Poker with your team?
Want to get estimations without having to pay for the number of estimations or people estimating?

This project provides a combination of a webpage with a backend that can be easily deployed as one docker container.

## How to use

```bash
docker build .
docker run -p 80:80 <IMAGE>
```

Webpage will be available on http://localhost:80

## Technologies used

### Frontend

- [Next.js](https://nextjs.org/)
- [Typescript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)

### Backend

- [Nest.js](https://docs.nestjs.com/)
- [Typescript](https://www.typescriptlang.org/)

### Deployment

- [Docker](https://www.docker.com/)
- [Nginx](https://nginx.org/)

## Open Source

This project is Open Source.
Pull requests will be reviewed and merged if the change seems reasonable.
Feel free to suggest changes and report bugs through the issues tab.
You can also always fork the repository and use it as a foundation for your own project.
