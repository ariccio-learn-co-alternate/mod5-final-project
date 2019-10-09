namespace :start do
  # Why'd it work for https://blog.heroku.com/a-rock-solid-modern-web-stack# and not me
  task :development do
    exec 'heroku local -f procfile'
  end
end

desc 'Start development server'
task :start => 'start:development'