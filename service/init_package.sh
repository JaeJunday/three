#!/bin/sh

pnpm install --prefix srcs

#pnpm add --prefix srcs --save-dev package-name
pnpm add --prefix srcs --save-dev @types/three


pnpm --prefix srcs run dev