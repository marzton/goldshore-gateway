resource "cloudflare_pages_project" "goldshore_web" {
  account_id        = var.cloudflare_account_id
  name              = "goldshore-web"
  production_branch = "main"

  source {
    type = "github"
    config {
      owner             = var.github_owner
      repo_name         = "goldshore-web"
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
        VITE_PUBLIC_API    = "https://api.goldshore.org"
        VITE_PUBLIC_GATEWAY = "https://gateway.goldshore.org"
        VITE_APP_ENV       = "production"
      }
    }
    preview {
      environment_variables = {
        VITE_PUBLIC_API    = "https://api-preview.goldshore.org"
        VITE_PUBLIC_GATEWAY = "https://gateway-preview.goldshore.org"
        VITE_APP_ENV       = "preview"
      }
    }
  }
}
