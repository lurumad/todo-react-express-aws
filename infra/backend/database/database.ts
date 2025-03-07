import { Construct } from 'constructs';
import * as ddb from 'aws-cdk-lib/aws-dynamodb';

export class Database extends Construct {
    public readonly table: ddb.Table;

    constructor(scope: Construct, id: string, props: DatabaseProps) {
        super(scope, id);

        this.table = new ddb.Table(this, 'TodosTable', {
            tableName: props.tableName,
            partitionKey: { name: 'id', type: ddb.AttributeType.STRING },
            billingMode: ddb.BillingMode.PAY_PER_REQUEST,
            encryption: ddb.TableEncryption.AWS_MANAGED,
        });
    }
}

export interface DatabaseProps {
    tableName: string;
}
