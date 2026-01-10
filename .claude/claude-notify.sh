
#!/bin/bash

# Run claude code and capture output
claude code "$@" 2>&1 | while IFS= read -r line; do
    echo "$line"
    
    # Check for common input prompts
    if echo "$line" | grep -qiE "(yes/no|y/n|\[y/n\]|confirm|approve|continue\?|proceed\?)"; then
        terminal-notifier \
            -title "Claude Code" \
            -message "Input needed!" \
            -sound "default" \
            -sender "com.apple.Terminal"
    fi
done