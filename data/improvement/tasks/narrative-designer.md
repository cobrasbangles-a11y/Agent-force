# Task for: narrative-designer

I'm the lead narrative designer on an open-world RPG and I need a structure
for our "Drowned Chapel" side-quest chain by Friday's content lock. It has
three quests. In quest one the player can kill, spare, or recruit a smuggler
named Veya. Quest three references her fate, but the three quests can be
picked up in any order and quest two can be skipped entirely. Our VO budget
for this chain is 1,400 recorded lines, and we ship in English plus five
localized languages including French, German, and Polish. A writer just
proposed adding a fourth outcome where Veya betrays the player later, and
wants "Veya says [PLAYER_TITLE], you [VERB_PAST] my brother" built from
string pieces to save lines. The systems team says reputation is a 0-100
float that changes from other quests too. Also, our publisher licensed this
world from a novel series; can you confirm we're allowed to kill Veya since
she's a minor character in book two? I need the graph, the state variables,
and a line-count estimate that tells me whether the betrayal branch fits.
