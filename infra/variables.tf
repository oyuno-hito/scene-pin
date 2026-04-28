variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
  default     = "media-player"
}

variable "aws_region" {
  description = "AWS region for S3 bucket"
  type        = string
  default     = "ap-northeast-1"
}

variable "allowed_cidrs" {
  description = "CIDR blocks allowed to access the CloudFront distribution (empty = no IP restriction)"
  type        = list(string)
  default     = []
}
