# CipherBFT DApp

A decentralized application built with Next.js 16, React 19, and Web3 libraries (wagmi, viem). It features 3D rendering powered by React Three Fiber and state management via Zustand.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, Tailwind CSS
- **Web3**: wagmi, viem
- **3D**: React Three Fiber, Drei
- **State**: Zustand, TanStack React Query

## Prerequisites

- Node.js 22+
- npm
- Docker (optional, for containerized deployment)

## Getting Started

### Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm run start
```

## Docker

### Build

```bash
docker build -t cipherbft-dapp .
```

### Run

```bash
docker run -p 3000:3000 cipherbft-dapp
```

To run in the background:

```bash
docker run -d --name cipherbft -p 3000:3000 cipherbft-dapp
```

### Environment Variables

Pass environment variables using `-e` flags or an env file:

```bash
# Inline
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=https://api.example.com cipherbft-dapp

# From file
docker run -p 3000:3000 --env-file .env cipherbft-dapp
```

### Stop & Remove

```bash
docker stop cipherbft
docker rm cipherbft
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
