aws s3 cp ./dist s3://mod-fed-test --recursive --acl public-read
aws cloudfront create-invalidation --distribution-id E2AZ8YOCEEFSRK --paths "/*"