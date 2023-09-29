# UPschooling React Support App

## Prerequisites

In order to run the development environment you will need to install some dependencies on your machine.

- [Docker](https://docs.docker.com/get-docker/)
- [Node.js (at least v16.14)](https://nodejs.org/en)
- [pnpm](https://pnpm.io/installation)

The development environment uses the following ports on your machine:

- 5173
- 80
- 8008
- 8080

## Installation

### 1. Edit your hosts file

Add the following to your hosts file.

```
# Upschooling React Support App settings
127.0.0.1 nextcloud.local
# End of section
```

The hosts file can usually be found

- in `/etc/hosts` for UNIX bases systems
- in `C:\Windows\System32\drivers\etc\hosts` for Windows systems

### 2. Start Synapse & Nextcloud

Run docker containers & network:

```bash
docker compose build
docker compose up
```

### 3. Build & serve frontend

Install dependencies:

```bash
pnpm install
```

Serve with hot reload at <http://localhost:5173>:

```bash
pnpm run dev
```

## Accounts

There are 3 preconfigured accounts:

- admin admin
- demouser1 upschooling1234!
- demouser2 upschooling1234!

## What is inside?

This project uses many tools like:

- [Vite](https://vitejs.dev)
- [ReactJS](https://reactjs.org)
- [TypeScript](https://www.typescriptlang.org)
- [Vitest](https://vitest.dev)
- [Testing Library](https://testing-library.com)
- [Tailwindcss](https://tailwindcss.com)
- [Eslint](https://eslint.org)
- [Prettier](https://prettier.io)
- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
- [Husky](https://typicode.github.io/husky/)
- [Lint Staged](https://github.com/okonet/lint-staged)
- [GitHub Actions](https://github.com/features/actions)
- [Docker Compose](https://docs.docker.com/compose/)

## License

This project is licensed under the MIT License.
