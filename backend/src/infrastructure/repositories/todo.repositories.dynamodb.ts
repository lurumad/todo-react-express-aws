import { Todo } from "@/domain/entities/model";
import { TodoRepository } from "@/domain/repositories/todo.repository";
import { DynamoDBClient, PutItemCommand, UpdateItemCommand, DeleteItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

const TABLE_NAME = process.env.TODOS_TABLE;
const IS_LOCAL = process.env.NODE_ENV === "dev";
const db = new DynamoDBClient({
    region: IS_LOCAL ? "us-east-1" : process.env.AWS_REGION,
    endpoint: IS_LOCAL ? "http://localhost:8000" : undefined,
    credentials: IS_LOCAL
        ? { accessKeyId: "fakeMyKeyId", secretAccessKey: "fakeSecretAccessKey" }
        : undefined,
});

export class DynamoDbTodoRepository implements TodoRepository {
    async add(todo: Todo): Promise<void> {
        const command = new PutItemCommand({
            TableName: TABLE_NAME,
            Item: marshall(todo),
        });

        await db.send(command);
    }

    async list(userId: string): Promise<Todo[]> {
        const filter = "userId = :userId";
        const values = { ":userId": { S: userId } };
        const command = new QueryCommand({
            TableName: TABLE_NAME,
            KeyConditionExpression: filter,
            ExpressionAttributeValues: values,
        });

        const { Items } = await db.send(command);

        return Items?.map((item) => unmarshall(item) as Todo) || [];
    }
    async delete(todo: Todo): Promise<void> {
        const command = new DeleteItemCommand({
            TableName: TABLE_NAME,
            Key: marshall({ userId: todo.userId, id: todo.id }),
        });

        await db.send(command);
    }
    async get(userId: string, id: string): Promise<Todo | undefined> {
        const filter = "userId = :userId AND id = :id";
        const values = { ":userId": { S: userId }, ":id": { S: id } };
        const command = new QueryCommand({
            TableName: TABLE_NAME,
            KeyConditionExpression: filter,
            ExpressionAttributeValues: values,
        });

        const { Items } = await db.send(command);

        return Items?.map((item) => unmarshall(item) as Todo)[0];
    }

    async update(todo: Todo): Promise<void> {
        const command = new UpdateItemCommand({
            TableName: TABLE_NAME,
            Key: marshall({ userId: todo.userId, id: todo.id }),
            UpdateExpression: "SET #status = :status",
            ExpressionAttributeNames: { "#status": "status" },
            ExpressionAttributeValues: marshall({ ":status": todo.status }),
        });

        await db.send(command);
    }
}