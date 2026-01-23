FROM ghcr.io/astral-sh/uv:python3.13-bookworm-slim

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential && \
    rm -rf /var/lib/apt/lists/*

# Copy project files
WORKDIR /app

# 컨테이너 안에서 애플리케이션 실행 시 첫 실행마다 .pyc를 만들 필요가 없어져서 실행속도 빨라짐
ENV UV_COMPILE_BYTECODE=1

# 심볼릭 링크를 사용하는 경우 os에 따라 symlink가 제대로 동작하지 않는 경우가 있는데, copy로 설정하면 문제 회피 가능
ENV UV_LINK_MODE=copy

# mount path to uv.lock and pyproject.toml
RUN --mount=type=bind,source=uv.lock,target=uv.lock \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    uv sync --frozen --no-install-project --no-dev

# Copy application code
COPY . /core/

# Expose port
EXPOSE 8000

# Start the application
CMD ["uv", "run", "uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
