from flask import Flask, render_template, request, redirect, url_for
import mysql.connector
import os

# Initialize Flask app
app = Flask(__name__)

# Database connection setup
def get_db_connection():
    conn = mysql.connector.connect(
        host="localhost",
        user="root",  # Change this if you use a different user
        password="admin",  # Your MySQL root password
        database="notes"  # Your database name
    )
    return conn

# Route for homepage (to show tasks)
@app.route('/')
def index():
    conn = mysql.connector.connect(
         host=os.environ.get("DB_HOST"),
         user=os.environ.get("DB_USER"),
         password=os.environ.get("DB_PASSWORD"),
         database=os.environ.get("DB_NAME")
    )

    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT * FROM tasks')
    tasks = cursor.fetchall()
    cursor.close()
    conn.close()
    return render_template('index.html', tasks=tasks)

# Route for adding a task
@app.route('/add', methods=['POST'])
def add_task():
    if request.method == 'POST':
        title = request.form['title']
        description = request.form['description']

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('INSERT INTO tasks (title, description) VALUES (%s, %s)', (title, description))
        conn.commit()
        cursor.close()
        conn.close()
        return redirect(url_for('index'))

# Route for deleting a task
@app.route('/delete/<int:id>', methods=['GET'])
def delete_task(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM tasks WHERE id = %s', (id,))
    conn.commit()
    cursor.close()
    conn.close()
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

