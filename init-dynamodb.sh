#!/bin/sh

echo "Waiting for DynamoDB Local to be ready..."
sleep 5

echo "Creating Todos table..."
aws dynamodb create-table \
    --table-name Todos \
    --attribute-definitions AttributeName=userId,AttributeType=S AttributeName=id,AttributeType=S \
    --key-schema AttributeName=userId,KeyType=HASH AttributeName=id,KeyType=RANGE \
    --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 \
    --endpoint-url http://localhost:8000

echo "Todos table created successfully!"
