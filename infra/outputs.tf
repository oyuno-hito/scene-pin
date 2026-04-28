output "s3_bucket_name" {
  description = "S3 bucket name for deployment"
  value       = aws_s3_bucket.site.id
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID for cache invalidation"
  value       = aws_cloudfront_distribution.site.id
}

output "cloudfront_domain" {
  description = "CloudFront distribution domain name"
  value       = aws_cloudfront_distribution.site.domain_name
}

output "site_url" {
  description = "URL of the hosted site"
  value       = "https://${aws_cloudfront_distribution.site.domain_name}"
}

output "terraform_role_arn" {
  description = "IAM Role ARN for GitHub Actions (set as AWS_ROLE_ARN secret)"
  value       = aws_iam_role.terraform_admin.arn
}
