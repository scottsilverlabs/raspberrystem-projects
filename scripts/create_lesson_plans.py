from bs4 import BeautifulSoup
import os
import re
import sys

def make_html_filename(s):
	'''Whitelist conversion from any string to a filename
	
	Allow only regex alphanumerics - change all else to underscores.  Strip any
	underscores from start/end of string.

	Add html extension.
	'''
	return re.sub(pattern=r'[^\w]+', repl='_', string=s).strip('_') + '.html'

with open(sys.argv[1]) as f:
	soup = BeautifulSoup(f)

#
# For each div.lesson_plan, extract the plan and write it to a new file (with
# the same head as the original file)
#
lesson_plans = [tag for tag in soup.select('div.project')]
for i, plan in enumerate(lesson_plans):
	plan.h2.string = "Project {}: {}".format(i + 1, plan.h2.string)
	soup.body.clear()
	soup.body.append(plan)
	filename = make_html_filename(plan.h2.string)
	with open(filename, 'w') as f:
		f.write(soup.prettify())

#
# Create an index file of the lesson plans
#
header = '''
<h2>Project Index</h2>
<ul>
'''
line_item_format = '<li><a href="{}">{}</a></li>'
tailer = '''
</ul>
'''
soup.body.clear()
soup.body.append(BeautifulSoup(header))
for plan in lesson_plans:
	filename = make_html_filename(plan.h2.string)
	soup.body.append(BeautifulSoup(line_item_format.format((filename), plan.h2.string)))
soup.body.append(BeautifulSoup(tailer))
with open("index.html", 'w') as f:
	f.write(soup.prettify())
