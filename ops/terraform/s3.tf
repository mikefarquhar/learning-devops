resource "aws_s3_bucket" "static_react_bucket" {
  bucket        = var.bucketName
  force_destroy = true
}

resource "aws_s3_bucket_ownership_controls" "static_react_bucket" {
  bucket = aws_s3_bucket.static_react_bucket.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_public_access_block" "static_react_bucket" {
  bucket = aws_s3_bucket.static_react_bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_acl" "static_react_bucket" {
  depends_on = [
    aws_s3_bucket_ownership_controls.static_react_bucket,
    aws_s3_bucket_public_access_block.static_react_bucket,
  ]

  bucket = aws_s3_bucket.static_react_bucket.id
  acl    = "public-read"
}

resource "aws_s3_bucket_versioning" "static_react_bucket" {
  bucket = aws_s3_bucket.static_react_bucket.id
  versioning_configuration {
    status = "Disabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "static_react_bucket" {
  bucket = aws_s3_bucket.static_react_bucket.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_cors_configuration" "static_react_bucket" {
  bucket = aws_s3_bucket.static_react_bucket.id

  cors_rule {
    allowed_methods = ["GET"]
    allowed_origins = ["*"]
  }
}

resource "aws_s3_bucket_website_configuration" "static_react_bucket" {
  bucket = aws_s3_bucket.static_react_bucket.id

  index_document {
    suffix = "index.html"
  }
}

data "aws_iam_policy_document" "static_react_bucket" {
  statement {
    sid    = "AllowCloudFrontServicePrincipalReadOnly"
    effect = "Allow"
    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    actions = ["s3:GetObject"]

    resources = ["${aws_s3_bucket.static_react_bucket.arn}/*"]

    condition {
      test     = "StringEquals"
      variable = "AWS:SoucreArn"
      values   = [aws_cloudfront_distribution.cf_distribution.arn]
    }
  }
}

resource "aws_s3_bucket_policy" "static_react_bucket" {
  bucket = aws_s3_bucket.static_react_bucket.id
  policy = data.aws_iam_policy_document.static_react_bucket.json
}
