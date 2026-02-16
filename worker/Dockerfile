FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package.json .
RUN npm install --production

# Copy application code
COPY . .

# Run the application
CMD ["npm", "start"]