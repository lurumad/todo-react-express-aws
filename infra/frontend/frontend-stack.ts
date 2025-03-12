import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as ssm from "aws-cdk-lib/aws-ssm";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import { Construct } from "constructs";

export class FrontendStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const bucket = new s3.Bucket(this, "TodosBucket", {
            bucketName: "todos-oacbucket",
            versioned: true,
            publicReadAccess: false,
            accessControl: s3.BucketAccessControl.PRIVATE,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            /**
             * The default removal policy is RETAIN, which means that cdk destroy will not attempt to delete
             * the new bucket, and it will remain in your account until manually deleted. By setting the policy to
             * DESTROY, cdk destroy will attempt to delete the bucket, but will error if the bucket is not empty.
             */
            removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production code
            /**
             * For sample purposes only, if you create an S3 bucket then populate it, stack destruction fails.
             * This setting will enable full cleanup of the demo.
             */
            autoDeleteObjects: true, // NOT recommended for production code
        });

        const logBucket = new s3.Bucket(this, "TodosLogBucket", {
            bucketName: "todos-logbucket",
            publicReadAccess: false,
            accessControl: s3.BucketAccessControl.PRIVATE,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            /**
             * The default removal policy is RETAIN, which means that cdk destroy will not attempt to delete
             * the new bucket, and it will remain in your account until manually deleted. By setting the policy to
             * DESTROY, cdk destroy will attempt to delete the bucket, but will error if the bucket is not empty.
             */
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: true, // NOT recommended for production code
        });

        const certificateArn = ssm.StringParameter.valueForStringParameter(this, '/web/certificateArn');
        const certificate = acm.Certificate.fromCertificateArn(this, 'TodosCertificate', certificateArn)

        new cloudfront.Distribution(
            this,
            "TodosDistribution",
            {
                defaultBehavior: {
                    origin: origins.S3BucketOrigin.withOriginAccessControl(bucket),
                    viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                },
                defaultRootObject: "index.html",
                domainNames: ["todos.luisruizpavon.com"],
                certificate,
                enableLogging: true,
                logBucket
            }
        );
    }
}
