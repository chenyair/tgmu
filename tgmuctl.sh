#!/bin/bash

TIMESTAMP=$(date +"%Y-%m-%d %T")

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
    echo "Removing current frontend build..."
    rm -rf ./backend/dist/ui
    echo "Copying frontend build to server..."
    cp -r ./frontend/dist ./backend/dist/ui
    echo "Successfully deployed frontend to server"
}

function frontend() {
    echo "----------------------------------------" >> ./frontend.build.log
    echo "[$TIMESTAMP] Starting deployment..." >> ./frontend.build.log
    echo "Building and deploying frontend changes..."
    echo "Starting build..."
    cd frontend

    BUILD_OUTPUT=$(npm run build)
    # check return code of last command
    if [ $? -ne 0 ]; then
        cd ..
        echo "$BUILD_OUTPUT" | tee -a ./frontend.build.log
        echo "Frontend build failed.. See above logs."
        exit 1
    fi

    cd ..
    echo "$BUILD_OUTPUT" >> ./frontend.build.log
    echo ""
    echo "Frontend build complete."
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
    echo "----------------------------------------" >> ./backend.build.log
    echo "[$TIMESTAMP] Starting deployment..." >> ./backend.build.log
    echo "Building and deploying backend changes..."
    echo "Starting build and pm2 restart (npm run prod)..."
    cd backend

    BUILD_OUTPUT=$(npm run prod)
    # check return code of last command
    if [ $? -ne 0 ]; then
        cd ..
        echo "$BUILD_OUTPUT" | tee -a ./backend.build.log
        echo "Backend build failed.. See above logs."
        exit 1
    fi

    cd ..
    echo "$BUILD_OUTPUT" >> ./backend.build.log
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

