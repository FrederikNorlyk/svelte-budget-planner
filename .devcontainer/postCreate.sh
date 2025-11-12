#!/usr/bin/env bash
set -e

# Install system dependencies
echo "Installing playwright"
sudo npx playwright install --with-deps

echo "Running apt update"
sudo apt update

echo "Installing neovim"
sudo apt install -y neovim

echo "Installing dependencies"
npm install
