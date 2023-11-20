terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "eu-west-1"
}

# S3
resource "aws_s3_bucket" "static_react_bucket" {
  bucket        = "mod-fed-test"
  force_destroy = true
}

resource "aws_s3_bucket_ownership_controls" "react_app_bucket_ownership_controls" {
  bucket = aws_s3_bucket.static_react_bucket.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_public_access_block" "block_public_access" {
  bucket = aws_s3_bucket.static_react_bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_acl" "static_react_bucket" {
  depends_on = [
    aws_s3_bucket_ownership_controls.react_app_bucket_ownership_controls,
    aws_s3_bucket_public_access_block.block_public_access,
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

  # error_document {
  #   key = "index.html"
  # }


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


resource "aws_s3_bucket_policy" "react_app_bucket_policy" {

  bucket = aws_s3_bucket.static_react_bucket.id
  policy = data.aws_iam_policy_document.static_react_bucket.json
}


# cloudfront
locals {
  s3_origin_id = "S3-mod-fed-test"
}

# resource "aws_cloudfront_origin_access_identity" "oai" {
#   comment = "Mod Fed Test OAI"
# }

resource "aws_cloudfront_origin_access_control" "mod-fed-test-oac" {
  name                              = "mod-fed-test-oac"
  description                       = "Module Federation Test OAC"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "cf_distribution" {
  origin {
    domain_name              = aws_s3_bucket.static_react_bucket.bucket_regional_domain_name
    origin_id                = local.s3_origin_id
    origin_access_control_id = aws_cloudfront_origin_access_control.mod-fed-test-oac.id
  }

  enabled         = true
  is_ipv6_enabled = true

  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = local.s3_origin_id

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
    compress               = true
  }

  price_class = "PriceClass_100"

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  retain_on_delete = true

  custom_error_response {
    error_caching_min_ttl = 300
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
  }

  custom_error_response {
    error_caching_min_ttl = 300
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
}
