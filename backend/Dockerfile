# Use Node.js official image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies including dev dependencies for build/seed capability, 
# though for strict prod we might prune.
# We also need openssl for Prisma on Alpine
RUN apk -U upgrade \
    && apk add --no-cache openssl \
    && npm install

# Copy source code and prisma schema
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Expose port
EXPOSE 3000

# Command to run (migration/seed/start logic often handled in entrypoint or compose command)
# For simplicity, we just start. Database setup handled via compose commands or pre-run
CMD ["npm", "run", "start"]
