import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';

export class ConsoleStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // S3 bucket for console website
    const consoleBucket = new s3.Bucket(this, 'ConsoleBucket', {
      bucketName: `opius-console-${this.account}-${this.region}`,
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Create Origin Access Identity for CloudFront
    const originAccessIdentity = new cloudfront.OriginAccessIdentity(this, 'ConsoleOAI', {
      comment: 'OAI for Opius Console',
    });

    // Grant CloudFront access to S3 bucket
    consoleBucket.grantRead(originAccessIdentity);

    // SSL Certificate for console.opiusai.com (must be in us-east-1)
    // Use cross-region certificate for CloudFront
    const certificate = acm.Certificate.fromCertificateArn(
      this,
      'ConsoleCertificate',
      'arn:aws:acm:us-east-1:891377179276:certificate/78c0157f-3cca-4697-98a8-8c957b908a18'
    );

    // CloudFront Function for URL rewriting (same as Holder Inc.)
    const indexRewriteFunction = new cloudfront.Function(this, 'ConsoleIndexRewrite', {
      functionName: 'opius-console-index-rewrite',
      code: cloudfront.FunctionCode.fromInline(`
        function handler(event) {
          var request = event.request;
          var uri = request.uri;
          
          // Handle root path
          if (uri === '/') {
            request.uri = '/mvp/index.html';
            return request;
          }
          
          // Handle console paths
          if (uri.startsWith('/console/')) {
            if (uri.endsWith('/')) {
              request.uri += 'index.html';
            } else if (!uri.includes('.')) {
              request.uri += '/index.html';
            }
          }
          // Handle mvp paths (existing console routes)
          else if (uri.startsWith('/mvp/')) {
            if (uri.endsWith('/')) {
              request.uri += 'index.html';
            } else if (!uri.includes('.')) {
              request.uri += '/index.html';
            }
          }
          // Default behavior for other paths
          else {
            if (uri.endsWith('/')) {
              request.uri += 'index.html';
            } else if (!uri.includes('.')) {
              request.uri += '/index.html';
            }
          }
          
          return request;
        }
      `),
      comment: 'Rewrite directory requests to index.html for console',
    });

    // CloudFront Distribution
    const distribution = new cloudfront.Distribution(this, 'ConsoleDistribution', {
      comment: 'Opius AI Enterprise Console',
      defaultRootObject: 'index.html',
      domainNames: ['console.opiusai.com'],
      certificate: certificate,
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessIdentity(consoleBucket, {
          originAccessIdentity: originAccessIdentity,
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
        compress: true,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        functionAssociations: [
          {
            function: indexRewriteFunction,
            eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
          },
        ],
      },
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      enableIpv6: true,
    });

    // Route 53 DNS record
    const hostedZone = route53.HostedZone.fromLookup(this, 'OpiusZone', {
      domainName: 'opiusai.com',
    });

    new route53.ARecord(this, 'ConsoleAliasRecord', {
      zone: hostedZone,
      recordName: 'console',
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
    });

    // Deploy console website content
    // Note: This will be updated to deploy the actual console build
    new s3deploy.BucketDeployment(this, 'ConsoleDeployment', {
      sources: [
        s3deploy.Source.data('index.html', `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Opius AI Enterprise Console</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              body { 
                margin: 0; 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                background: linear-gradient(135deg, #2CB8E9 0%, #8D6CF2 50%, #E26AE6 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
              }
              .container {
                text-align: center;
                padding: 40px;
                border-radius: 30px;
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
              }
              h1 { font-size: 3rem; margin-bottom: 1rem; }
              p { font-size: 1.2rem; opacity: 0.9; }
              .status { 
                background: rgba(0, 255, 0, 0.2);
                padding: 10px 20px;
                border-radius: 20px;
                margin: 20px 0;
                display: inline-block;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>🚀 Opius AI Enterprise Console</h1>
              <div class="status">✅ Infrastructure Deployed</div>
              <p>Console deployment successful!<br>Ready for enterprise console integration.</p>
              <p><small>Domain: console.opiusai.com</small></p>
            </div>
          </body>
          </html>
        `),
      ],
      destinationBucket: consoleBucket,
      distribution: distribution,
      distributionPaths: ['/*'],
    });

    // Outputs
    new cdk.CfnOutput(this, 'ConsoleBucketName', {
      value: consoleBucket.bucketName,
      description: 'S3 bucket name for console website',
    });

    new cdk.CfnOutput(this, 'ConsoleDistributionId', {
      value: distribution.distributionId,
      description: 'CloudFront distribution ID for console',
    });

    new cdk.CfnOutput(this, 'ConsoleDistributionDomain', {
      value: distribution.distributionDomainName,
      description: 'CloudFront distribution domain name',
    });

    new cdk.CfnOutput(this, 'ConsoleURL', {
      value: 'https://console.opiusai.com',
      description: 'Console website URL',
    });
  }
}