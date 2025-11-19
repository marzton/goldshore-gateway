terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4"
    }
  }
}

variable "cloudflare_account_id" {
  description = "The Cloudflare account ID."
  type        = string
}

variable "github_owner" {
  description = "The GitHub username or organization."
  type        = string
}

variable "cloudflare_api_token" {
  description = "The Cloudflare API token."
  type        = string
  sensitive   = true
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

resource "cloudflare_pages_project" "goldshore_admin" {
  account_id        = var.cloudflare_account_id
  name              = "goldshore-admin"
  production_branch = "main"

  source {
    type = "github"
    config {
      owner             = var.github_owner
      repo_name         = "goldshore-admin"
      production_branch = "main"
    }
  }

  build_config {
    build_command    = "npm run build"
    build_output_dir = "dist"
  }

  deployment_configs {
    production {
      environment_variables = {
        CF_ACCESS_ISS      = "https://goldshore.cloudflareaccess.com"
        CF_ACCESS_JWKS_URL = "https://goldshore.cloudflareaccess.com/cdn-cgi/access/certs"
      }
    }
  }
}
