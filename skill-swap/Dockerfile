# First (and only) Stage: Build & Serve
FROM oven/bun:1

# Set the working directory
WORKDIR /app

# Copy package.json and bun.lock
COPY package.json bun.lock ./

# Install dependencies with bun
RUN bun install

# Install serve globally (optional, but included since you had it before)
RUN bun add -g serve

# Copy the rest of the source code
COPY . .

# Build the project
RUN bun run build

# Serve the built app on port 4000
CMD ["serve", "-s", "dist", "-l", "4000"]
