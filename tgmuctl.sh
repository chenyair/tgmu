#!/bin/bash

# Function to display usage
function usage() {
    echo "Usage: $0 [-f | --frontend] [-b | --backend] [-a | --all] [-h | --help]"
}

# Function to display help
function help() {
    usage
    echo "Help:"
    echo "-f, --frontend: build and deploy frontend changes"
    echo "-b, --backend: build and deploy backend changes"
    echo "-a, --all: build and deploy entire application"
    echo "-h, --help: Print help message"
}

function frontend_deploy() {
    echo "Removing current build..."
    rm -rf ./backend/dist/ui
    echo "Copying build to server..."
    cp -r ./frontend/dist ./backend/dist/ui
    echo "Successfully deployed frontend to server"
}

function frontend() {
    echo "Building and deploying frontend changes..."
    echo "Starting build..."
    cd frontend
    npm run build >> ./frontend.build.log
    echo ""
    cd ..
    echo "Build complete."
    echo ""
    if [[ $1 == "deploy" ]]; then
        frontend_deploy
    else
        echo "Removing current frontend build from backend source..."
        rm -rf ./backend/src/ui
        echo "Copying frontend build to backend source..."
        cp -r ./frontend/dist backend/src/ui
        echo "Copied frontend build to backend source"
    fi
    echo "frontend: Done!"
}

function backend() {
    echo "Building and deploying backend changes..."
    echo "Starting build and pm2 restart (npm run prod)..."
    cd backend
    npm run prod >> ./backend.build.log
    cd ..
    echo ""
    echo "Successfully updated backend"
    echo "backend: Done!"
}

function all() {
    echo "Building and deploying entire application..."
    frontend
    backend
    frontend_deploy
} 

# If no arguments were passed, display usage
if [ $# -eq 0 ]; then
    usage
    exit 1
fi


# Parse options
while (( "$#" )); do
  case "$1" in
    -f|--frontend)
      frontend deploy
      exit 0
      ;;
    -b|--backend)
      backend
      exit 0
      ;;
    -a|--all)
      all
      shift
      ;;
    -h|--help)
      help
      exit 0
      ;;
    *)
      echo "Error: Invalid argument"
      usage
      exit 1
      ;;
  esac
done

