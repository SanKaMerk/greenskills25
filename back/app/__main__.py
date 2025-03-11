import uvicorn

if __name__ == '__main__':
    uvicorn.run('main:create_app', host='localhost', port=8000, factory=True, reload=True)