"""
Logging configuration for Koru backend.

Provides structured, colored console output and file logging for debugging.
"""

import logging
import sys
from datetime import datetime
from pathlib import Path
from typing import Optional

# Create logs directory
LOGS_DIR = Path(__file__).parent.parent / "logs"
LOGS_DIR.mkdir(exist_ok=True)


class ColoredFormatter(logging.Formatter):
    """Custom formatter with colors for console output."""

    # ANSI color codes
    COLORS = {
        "DEBUG": "\033[36m",     # Cyan
        "INFO": "\033[32m",      # Green
        "WARNING": "\033[33m",   # Yellow
        "ERROR": "\033[31m",     # Red
        "CRITICAL": "\033[35m",  # Magenta
    }
    RESET = "\033[0m"
    BOLD = "\033[1m"
    DIM = "\033[2m"

    def format(self, record: logging.LogRecord) -> str:
        # Add color based on level
        color = self.COLORS.get(record.levelname, "")

        # Format timestamp
        timestamp = datetime.fromtimestamp(record.created).strftime("%H:%M:%S.%f")[:-3]

        # Format the message
        level = f"{color}{record.levelname:8}{self.RESET}"
        name = f"{self.DIM}{record.name:25}{self.RESET}"

        # Include exception info if present
        msg = record.getMessage()
        if record.exc_info:
            msg += "\n" + self.formatException(record.exc_info)

        return f"{self.DIM}{timestamp}{self.RESET} {level} {name} {msg}"


class FileFormatter(logging.Formatter):
    """Detailed formatter for file logging."""

    def format(self, record: logging.LogRecord) -> str:
        timestamp = datetime.fromtimestamp(record.created).strftime("%Y-%m-%d %H:%M:%S.%f")[:-3]

        # Build detailed log line
        line = f"{timestamp} | {record.levelname:8} | {record.name:30} | {record.getMessage()}"

        # Add file/line info for errors
        if record.levelno >= logging.WARNING:
            line += f" | {record.filename}:{record.lineno}"

        # Include exception info if present
        if record.exc_info:
            line += "\n" + self.formatException(record.exc_info)

        return line


def setup_logging(
    level: str = "DEBUG",
    log_file: Optional[str] = None,
    enable_file_logging: bool = True,
) -> logging.Logger:
    """
    Configure logging for the application.

    Args:
        level: Logging level (DEBUG, INFO, WARNING, ERROR)
        log_file: Custom log file name (default: koru_YYYY-MM-DD.log)
        enable_file_logging: Whether to write logs to file

    Returns:
        Root logger instance
    """
    # Get root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(getattr(logging, level.upper()))

    # Clear existing handlers
    root_logger.handlers.clear()

    # Console handler with colors
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.DEBUG)
    console_handler.setFormatter(ColoredFormatter())
    root_logger.addHandler(console_handler)

    # File handler for persistent logs
    if enable_file_logging:
        if log_file is None:
            log_file = f"koru_{datetime.now().strftime('%Y-%m-%d')}.log"

        file_path = LOGS_DIR / log_file
        file_handler = logging.FileHandler(file_path, encoding="utf-8")
        file_handler.setLevel(logging.DEBUG)
        file_handler.setFormatter(FileFormatter())
        root_logger.addHandler(file_handler)

        # Log the file location
        root_logger.info(f"Logging to file: {file_path}")

    # Reduce noise from third-party libraries
    logging.getLogger("httpx").setLevel(logging.WARNING)
    logging.getLogger("httpcore").setLevel(logging.WARNING)
    logging.getLogger("uvicorn.access").setLevel(logging.INFO)
    logging.getLogger("uvicorn.error").setLevel(logging.INFO)

    return root_logger


def get_logger(name: str) -> logging.Logger:
    """
    Get a logger instance for a module.

    Usage:
        from app.logging_config import get_logger
        logger = get_logger(__name__)
        logger.info("Something happened")
    """
    return logging.getLogger(name)


# Request logging middleware helper
class RequestLogger:
    """Helper for logging HTTP requests with context."""

    def __init__(self, logger: logging.Logger):
        self.logger = logger

    def log_request(self, method: str, path: str, status: int, duration_ms: float):
        """Log an HTTP request."""
        if status >= 500:
            self.logger.error(f"{method} {path} -> {status} ({duration_ms:.1f}ms)")
        elif status >= 400:
            self.logger.warning(f"{method} {path} -> {status} ({duration_ms:.1f}ms)")
        else:
            self.logger.info(f"{method} {path} -> {status} ({duration_ms:.1f}ms)")

    def log_error(self, method: str, path: str, error: Exception):
        """Log a request error."""
        self.logger.error(f"{method} {path} -> ERROR: {type(error).__name__}: {error}")
