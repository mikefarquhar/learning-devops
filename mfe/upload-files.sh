aws s3 cp ./dist s3://mod-fed-test/mfe --recursive --acl public-read
aws cloudfront create-invalidation --distribution-id E2G69B794QNGL1 --paths "/mfe/*"