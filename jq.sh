#!/bin/bash

IMAGE="todo-backend:latest"
FULL_IMAGE="todo-backend:latest"

DEFS='{
    "taskDefinitionArn": "arn:aws:ecs:us-east-1:***:task-definition/BackendStackTodosTaskDef16C5603C:9",
    "containerDefinitions": [
        {
            "name": "web",
            "image": "***.dkr.ecr.us-east-1.amazonaws.com/todo-backend:latest",
            "cpu": 0,
            "portMappings": [
                {
                    "containerPort": 3001,
                    "hostPort": 3001,
                    "protocol": "tcp"
                }
            ],
            "environment": [
                { "name": "TODOS_TABLE", "value": "Todos" },
                { "name": "AWS_REGION", "value": "us-east-1" },
                { "name": "NODE_ENV", "value": "production" },
                { "name": "PORT", "value": "3001" },
                { "name": "FRONTEND_URL", "value": "https://todos.luisruizpavon.com" }
            ],
            "logConfiguration": {
                "logDriver": "awslogs",
                "options": {
                    "awslogs-group": "Todos",
                    "awslogs-region": "us-east-1",
                    "awslogs-stream-prefix": "Todos"
                }
            }
        }
    ],
    "family": "BackendStackTodosTaskDef16C5603C",
    "cpu": "256",
    "memory": "512",
    "status": "ACTIVE"
}'

echo "${DEFS}" | jq '.containerDefinitions[].image'

INDEX=$(echo "${DEFS}" | jq -r '
  .containerDefinitions
  | map(.image | endswith("'$IMAGE'"))
  | index(true)'
)

echo $INDEX

NEW_DEFS=$(echo "${DEFS}" | jq 'del(.taskDefinitionArn, .revision, .registeredAt, .registeredBy, .status, .requiresAttributes, .compatibilities)' | jq '.containerDefinitions['$INDEX'].image="'$FULL_IMAGE'"')
echo $NEW_DEFS
