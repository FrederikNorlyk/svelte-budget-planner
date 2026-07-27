#!/usr/bin/env bash
set -e

# Set up pnpm
corepack enable
corepack prepare pnpm@11.11.0 --activate
pnpm install

# Install Playwright
sudo pnpm dlx playwright install --with-deps