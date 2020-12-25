
module Errors
  def create_error(message, error)
    puts error.class
    {
      message: [message],
      error: [error]
    }
  end

  def create_jwt_error(message, jwtError)
    errors = jwtError.message
    {
      message: [message],
      error: errors
    }
  end

  def create_activerecord_error(message, activeRecordError)
    errors = activeRecordError.record.errors.full_messages;
    # puts "errors: #{errors}"
    {
      message: [message],
      error: errors
    }
  end

  def create_activerecord_notfound_error(message, activeRecordError)
    errors = [activeRecordError.id, activeRecordError.model];
    # puts "errors: #{errors}"
    {
      message: [message],
      error: errors
    }
  end

  def create_missing_auth_header(message)
    errors = []
    {
      message: [message],
      error: errors
    }
  end
end