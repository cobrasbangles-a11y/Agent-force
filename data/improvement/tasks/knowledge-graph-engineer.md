# Task for: knowledge-graph-engineer

I'm leading a project to build a knowledge graph of our biomedical
literature and internal assay data (about 2.4M papers, 180K compounds, 21K
genes, and 3 internal assay databases) to power a scientist-facing search
and a "related targets" recommender. Pilot demo is December 5. Our three
assay databases each name compounds differently (internal IDs, vendor
catalog numbers, and SMILES strings with inconsistent salt forms), and gene
names in papers are ambiguous (for example, symbols that are also common
English words). The prototype someone built put "Paper MENTIONS Gene" edges
for every text match, and a query for targets related to a popular kinase
now takes 40 seconds and returns junk. The team wants to decide between a
property graph and RDF this week. Also, some internal assay data is from a
partner collaboration under contract and only a named group of scientists
can see it. How would you design this, and what would you do first?
