import psycopg2

conn = psycopg2.connect('postgresql://postgres:8610458620@localhost:5432/ai_workspace')
cur = conn.cursor()
cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name='conversations'")
print(cur.fetchall())
cur.close()
conn.close()
