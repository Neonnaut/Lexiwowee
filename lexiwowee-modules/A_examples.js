function getLexExample(example) {
    var choice = '';

    if (example == "basic") {
        choice = `features: std-ipa-features

letters: ʔ a á b ch d e g h i k l m n o p r s t u w y

+stop = p b t d k g 
+nasal = m n ng

C = t n k m ch l ʔ s r d h w b y p g
D = n l ʔ t k r p
V = a i e á u o

$S = CVD?

words: V?$S$S V?$S V?$S$S$S

engines: std-assimilations coronal-metathesis

# haplology
reject: (..+)\\1+

reject: wu yi w$ y$ h$ ʔʔ (p|t|k|ʔ)h
filter: nr > tr; mr > pr; ŋ > n`;
    } else if (example == "basic-ex") {
        choice = `# See the documentation below for full details.

# These set up assimilations ("np" will be changed to "mp") and a few other
# minor things.  It is possible for assimilations to produce phonemes you
# don't want, which is why one of the filters below is: ŋ > n.
with: std-ipa-features std-assimilations coronal-metathesis

# This determines the sort order of the output, and also helps
# the 'with:' line settings understand what is going on.
letters: ʔ a á b ch d e g h i k l m n o p r s t u w y

# THE ORDER OF PHONEME CLASSES MATTERS.  The very first phoneme
# will be picked much, much more often than the last.  The order
# here is approximately natural for a lot of languages.  You can
# change the character of a language a lot by shuffling which
# phonemes occur most often, or the least.
C = t n k m ch l ʔ s r d h w b y p g
D = n l ʔ t k r p
V = a i e á u o

# Macros are only a convenience to reduce typing, and do simple
# substitution only.  You can't use macros inside other macros.
$S = CVD?

# The first word shape will be picked most often, the last least
# often.
words: V?$S$S V?$S V?$S$S$S

# Rejections and filters use Javascript regular expressions.
# 'reject:' simply throws away a word.  Filter turns certain
# patterns into something else.
reject: wu yi w$ y$ h$ ʔʔ (p|t|k|ʔ)h
filter: nr > tr; mr > pr; ŋ > n

# Haplology - remove repeats.
reject: (..+)\\1+`;
    } else if (example == "tonal") {
        choice = `# A tonal language with a slightly odd phoneme inventory.
# Turn on "Show generation steps" and select a number of words to
# see how this operates.

C = t n k l ch m kw v j tl y d tw s zh f g sh dw w t' z gh k' sw ng zw gw ch' nw kh tl' ngw ny kw' ɬ ghw khw b dl p
F = n m s ng ɬ t kh k khw p
U = a i u e ou ei o
V = a i e u ou ai oi au o ei eu 

# I fake tone with digits.  Because the tones are not in a power
# distribution, I give explicit weights, with the unmarked, middle tone
# occurring most often, and the contour tone the least often.  The
# digits are converted to something more familiar at the end of the
# definition.
T = 0:1.5 1:1 2:1 3:0.5

# Make optional elements - marked with '?' - occur 35% of the time.
random-rate: 35

words: CUTF? CVT UTF? VT

filter: yi > i
filter: wau > wai

# Simplify labiovelars.  Purely arbitrary substitution, but one that
# results in still legal diphthongs.
% o u
w wa we

reject: nyi nye o$ o1$ o2$ o3$ e$ e1$ e2$ e3$ 

# Turn tone numbers into diacritics.
% 0 1 2 3
a a á à ǎ
e e é è ě
i i í ì ǐ
o o ó ò ǒ
u u ú ù ǔ`;
    } else if (example == "australian") {
        choice = `name: australian-like
random-rate: 8
# This does not represent a single Australian language, but produce something
# Australian looking. The glottal stop and lack of retroflex stops make it
# not an 'average' Australian language word list, but not unusual.
# I use <ṫ ṅ ň č> for [t̪ n̪ ɲ c] and <R, @> for length and coda-matching.
# <ṫ ṅ ŋ ň č ʎ j ɹ r ʔ> romanise as <th nh ng ny j ly y r rr ꞌ> at the end.

# CONSONANTS:
# p ṫ t   č k ʔ
# m ṅ n   ň ŋ
#     r ɹ j w 
#     l   ʎ

# Initials:
I = k p m w S č ŋ j t ň n ʎ ṫ ṅ
J = k p m w č ŋ j t ň n ʎ ṫ ṅ
# Medials
C = k m ɹ l r n č p ŋ ň ṫ w j ṅ t ʎ ʔ
# Finals
F = @n @ň @l @r @ɹ @x @lq @rq @ɹq

# VOWELS: a aa i ii u uu ee oo; things happen to <ee> and <oo> later on.
V = a:45 i:39 u:37 oR:2 eR:2 aR:2 iR:2 uR:2 ai:1

# Syllable shapes: CV(F), CVFNCV. (C is optional word initially).
# <l r ɹ> do not occur word initially. only <n ň l r ɹ> occur word finally.
# Disylabic words must begin with a vowel
$S = CVF?
$T = IVF?
$X = JVF?

words: $T$S$S$S $T$S$S$S$S $T$S$S $X$S $T$S$S$S$S$S

# Get vowel initial words
filter: S>!

# The following consonant clusters are permissible:
# [a homorganic nasal] + [stop sequence]
# <l> + [a non-apical stop] / [a peripheral nasal]
# <l> + [homorganic nonapical nasal] + [stop sequence]
# <r> + [a peripheral stop] / [a peripheral nasal]
# <r> + [a homorganic peripheral nasal] + [stop sequence]
# <ɹ> + [a peripheral stop] / [a non-palatal nasal]
# <ɹ> + [a homorganic non-palatal nasal] + [stop sequence]
# <k / t> + <p>
# <ṫ / ṅ> + <ʔ>
%  p   ṫ   t   č   k   m  ṅ  ŋ  n  ň ʔ y w ʎ r ɹ l
n  mp  ṅṫ  nt  ñč  ŋk  m  ṅ  ŋ  n  ň ʔ y w ʎ r ɹ l
ň  p   ṫ   t   č   k   m  ṅ  ŋ  n  ň ʔ y w ʎ r ɹ l
l  lp  lṫ  t   lč  lk  lm lṅ lŋ n  ň ʔ y w ʎ r ɹ l
r  rp  ṫ   t   rč  rk  rm ṅ  rŋ n  ň ʔ y w ʎ r ɹ l
ɹ  ɹp  ṫ   t   ɹč  ɹk  ɹm ṅ  ɹŋ ɹn ň ʔ y w ʎ r ɹ l
x  p   ṫʔ  tp  č   kp  m  ṅʔ ŋ  n  ň ʔ y w ʎ r ɹ l
lq lmp lṅṫ t   lñč lŋk m  ṅ  ŋ  n  ň ʔ y w ʎ r ɹ l
rq rmp ṫ   t   rñč rŋk m  ṅ  ŋ  n  ň ʔ y w ʎ r ɹ l
ɹq ɹmp ɹṅṫ ɹnt č   ɹŋk m  ṅ  ŋ  n  ň ʔ y w ʎ r ɹ l

# <ee> and <oo> cannot be word initial or final.
filter: ^eR > i; ^oR > u; eR$ > i; oR$ > u

# Long vowels become short before a consonant cluster or <ʔ>
%  @  ʔ
oR o@ oʔ
eR e@ eʔ
iR i@ iʔ
aR a@ aʔ

# Restrict the occurance of <ai>
%  ʔ  č  ŋ  ň  j  w  ʎ  r  ɹ  @ň  @r  @l  @ɹ  @n  @x  @lq  @rq  @ɹq
ai aʔ ač aŋ añ aj aw aʎ ar aɹ a@ň a@r a@l a@ɹ a@n a@x a@lq a@rq a@ɹq

# Long vowels become short at the beginning of a word
filter: ^aR>a; ^iR>a; ^uR>u; ^ai>a

# i → e / #C[+palatal]aC[-palatal]_
%   pi   ṫi   ti   ki   mi   ṅi   ŋi   ni   ñi   ʔi   wi   ri   ɹi   li
^ja jape jaṫe jate jake jame jaṅe jaŋe jane jañe jaʔe jawe jare jaɹe jale
^ča čape čaṫe čate čake čame čaṅe čaŋe čane čañe čaʔe čawe čare čaɹe čale
^ʎa ʎape ʎaṫe ʎate ʎake ʎame ʎaṅe ʎaŋe ʎane ʎañe ʎaʔe ʎawe ʎare ʎaɹe ʎale
^ña ñape ñaṫe ñate ñake ñame ñaṅe ñaŋe ñane ñañe ñaʔe ñawe ñare ñaɹe ñale

# a → i / #C[+palatal]V[-long]C[-palatal]_
%   pa   ṫa   ta   ka   ma   ṅa   ŋa   na   ña   ʔa   wa   ra   ɹa   la
^ja japi jaṫi jati jaki jami jaṅi jaŋi jani jañi jaʔi jawi jari jaɹi jali
^ju jupi juṫi juti juki jumi juṅi juŋi juni juñi juʔi juwi juri juɹi juli
^ʎa ʎapi ʎaṫi ʎati ʎaki ʎami ʎaṅi ʎaŋi ʎani ʎañi ʎaʔi ʎawi ʎari ʎaɹi ʎali
^ʎu ʎupi ʎuṫi ʎuti ʎuki ʎumi ʎuṅi ʎuŋi ʎuni ʎuñi ʎuʔi ʎuwi ʎuri ʎuɹi ʎuli
^ča čapi čaṫi čati čaki čami čaṅi čaŋi čani čañi čaʔi čawi čari čaɹi čali
^ču čupi čuṫi čuti čuki čumi čuṅi čuŋi čuni čuñi čuʔi čuwi čuri čuɹi čuli
^či čipi čiṫi čiti čiki čimi čiṅi čiŋi čini čiñi čiʔi čiwi čiri čiɹi čili
^ña ñapi ñaṫi ñati ñaki ñami ñaṅi ñaŋi ñani ñañi ñaʔi ñawi ñari ñaɹi ñali
^ñu ñupi ñuṫi ñuti ñuki ñumi ñuṅi ñuŋi ñuni ñuñi ñuʔi ñuwi ñuri ñuɹi ñuli
^ñi ñipi ñiṫi ñiti ñiki ñimi ñiṅi ñiŋi ñini ñiñi ñiʔi ñiwi ñiri ñiɹi ñili

# <ji>, <ʎi> and <wu> become <je>, <ʎe> and <wo>
filter: jiR>je; wuR>wo; ʎiR>ʎe; ji>je; ʎi>ʎe; wu>wo
filter: je$>ju; wo$>ŋu; ʎe$>ʎa;
filter: e$>i; o$>u; eR$>i; oR$>u; 
 
filter: x>!; q>!; @>!; 
filter: oR>oo; eR>ee; iR>ii; uR>uu; aR>aa

# Romaniser:
filter: r>rr; ɹ>r; ṅ>nh; ṫ>th; ň>nj; ʎ>lj; ʔ>ꞌ

# Englishiser
filter: nj>ny; č>j; lj>ly; j>y; ŋ>ng;`;
    } else if (example == "japanese") {
        choice = `name: Japanese-like 
# Japanese-like based on interpreting wikipedia.org/wiki/Japanese_phonology 
# and link.springer.com/content/pdf/10.3758/BF03195600.pdf

# <x> gives me onsetless morae later on
C = k:45 t:39 s:33 r:25 n:20 x:15 h:10 m:10 d:8 g:8 z:4 b:4 w:3 p:2
I = k:45 x:40 t:39 s:33 n:20 m:10 h:8 d:6 g:6 r:4 z:2 b:2 w:2 p:2
V = a:233 i:226 u:215 o:204 e:190 ya:8 yu:8 yo:8 oo:2 ai:3 aa:2 ii:2 ee:2 uu:1
W = a:223 i:216 u:205 o:194 e:180 ya:5 yu:5 yo:5
X = oo:12 ai:10 aa:12 ii:12 ee:11 uu:1 yoo:2 yai:1 yaa:1 yuu:1
F = N Q

random-rate: 9

$S = CVF? # Gives type C(y/V)V(N/Q).
$A = IVF? # First syllable of slightly different consonant distribution.

$L = CW # C(y)V, light syllable type
$H = CX # C(y)VV, Heavy syllable of long vowel
$J = CVF # C(y)V[N/Q], heavy syllable with <N> or <Q>

# Where light syllable is of type (C)V, and heavy is (C)[VF/VV(F)].
# The final two syllables are least likely to be light followed by heavy.
# I will be sneaking in one-syllable words into the LH class as well.

#words: $A$S$S $A$S$L $A$S$S$S $A$S$S$L $A$S$S$S$L $A$S$S$L$L $A$L

categories: LL:60 LH-a:1 LH-b:2 HL-a:5 HL-b:20 HH-a:1 HH-b:1 HH-c:2 HH-d:2
LL = $A$L$L $A$S$L$L $A$S$S$L$L $A$L
LH-a = $S $A$L$H $A$S$L$H $A$S$S$L$H $A$H
LH-b = $S $A$L$J $A$S$L$J $A$S$S$L$J $A$J
HL-a = $A$H$L $A$S$H$L $A$S$S$H$L $A$L
HL-b = $A$J$L $A$S$J$L $A$S$S$J$L $A$L
HH-a = $A$H$H $A$S$H$H $A$S$S$H$H $A$H
HH-b = $A$H$J $A$S$H$J $A$S$S$H$J $A$J
HH-c = $A$J$J $A$S$J$J $A$S$S$J$J $A$J
HH-d = $A$J$H $A$S$J$H $A$S$S$J$H $A$J

filter: axa > a; ixi > i; uxu > u; oxo > o; uxu > u; exe > e
filter: x > !;

# These changes historically happened
%  u   
a  oo  
i  yuu 
u  +  
e  yoo 
o  oo

# Allowed C(y)V morae
# Yotsugana: <dz> and <dj> neutralise to <z> and <j>
%  a   i    u   e   o   ya   yu   yo
k  ka  ki   ku  ke  ko  kya  kyu  kyo
g  ga  gi   gu  ge  go  gya  gyu  gyo
s  sa  ši   su  se  so  ša   šu   šo
z  za  ji   zu  ze  zo  ja   ju   jo 
t  ta  či   cu  te  to  ča   ču   čo
d  da  ji   zu  de  do  ja   ju   jo
n  na  ni   nu  ne  no  nya  nyu  nyo
h  ha  hi   fu  he  ho  hya  hyu  hyo
b  ba  bi   bu  be  bo  bya  byu  byo
p  pa  pi   pu  pe  po  pya  pyu  pyo
m  ma  mi   mu  me  mo  mya  myu  myo
r  ra  ri   ru  re  ro  rya  ryu  ryo
w  wa  i    wa  e   o   ya   yu   yo

# Long-vowel + <Q> is illegal.
filter: aaQ > aa; iiQ > ii; uuQ > uu; ooQ > oo; eeQ > ee;

# <N> assimilation and <Q> gemination.
# Only <k s (š) t (c) p h> can geminate. <hQ fQ wQ> is <pp>; historically.
% č  š  c   j  k  g  s  z  t  d  n  h  b  p  m  r  l  f   w   y
Q tč šš tc  j  kk g  ss z  tt d  n  pp b  pp m  r  l  pp  pp  y
N nč nš nc  nj nk ng ns nz nt nd nn nh mb mp mm nr nl nf  nw  ny

# Phonetically, <N> word finally is [ɴ],
# except after /i/ or /e/ is [ŋ]. Between vowel or before
# /j, w, ɸ, s, ɕ, ç, h], is a nasalized vowel/semivowel. I'll use <n'> here. 
% a    e    i    o    u    y
N n'a  n'e  n'i  n'o  n'u  n'y

filter: N > n; Q > !; niga$ > nega

filter: c> ts; č > ch; š > sh; # This was to stop <chu> becoming <cfu>.

# There some other phonetic stuff such as /r/ becoming lateral/retroflex after
# /i, e/ or at the beginning of a word. /b/, /g/ becoming [β], [ɣ/ŋ]
# between vowels. And the pitch accent. But these are dependant on dialect,
# and are not shown in any writing system of Japanese.`;
    } else if (example == "hungarian") {
        choice = `name: Hungarian-like
# This isn't quite Hungarian, but approximates it for demonstration
# purposes.  The cluster restrictions, in particular, are based on
# Hungarian data:
#
#    http://real-d.mtak.hu/233/1/Torkenczy_Miklos.pdf
#
# But I have left out the front, rounded vowels and some of the
# palatalized consonants.

with: std-ipa-features std-assimilations coronal-metathesis

letters: a á b c d dz dʒ e é f g h i í j k kl kr l m n o ó p pr r s ʃ t tr ts tʃ u ú v z ʒ '

C = t n k tʃ s m r ʃ d h p ts v l d b ʒ dʒ f j z p g dz

# Some initial fricative + C clusters
D = s ʃ v ʒ f z
E = t n k tʃ m r p ts l v f p

# Cluster rules... notice the single quote mark, which I will use in
# the 'words:' section below, to mark of syllable boundaries.  This
# lets me more carefully craft where clusters are allowed and where
# they are forbidden.

%  p t k ts tʃ f v m n l r
'f - + - -  -  - - - - + +
'v - - - -  -  - - - - + -
's + + + +  -  + + + + + -
'ʃ + + - -  +  - + + + + +
'z - - - -  -  - - - - + +
'ʒ - - - -  -  - - - - - -

# For initial complex clusters.
W = s ʃ
X = tr kr kl pr

%  pr tr kr kl
's -  +  -  +
'ʃ +  +  +  -

V = a i e á u o é í ó ú
S = s z ʃ
R = n l r m

# Vowel clusters
% i e u o a í é ú ó á
i - + + + + - + + + +
e + - + + + - - - + +
u + + - + + + - - + +
o + + - - + - + - - +
a + + + + - + - - + -
í - - - - - - - - - -
é - - - - - - - - - -
ú - - - - - - - - - -
ó - - - - - - - - - -
á - - - - - - - - - -

# Coda clusters
T = t n k tʃ s m r ʃ d p ts v l d dʒ b ʒ f j z p g dz

# This rejects a mass of final clusters, and makes word generation
# a bit slow.
%  p' t' k' b' d' g' ts' tʃ' dʒ' f' s' ʃ' v' z' ʒ' m' n' l' r' j'
p  +  +  -  -  -  -  -   -   -   +  +  +  -  -  -  -  -  -  -  -
t  -  +  +  -  -  -  -   -   -   -  -  -  -  -  -  -  -  -  -  -
k  -  -  +  -  -  -  -   +   -   -  +  +  -  -  -  -  -  -  -  -
b  -  -  -  +  -  -  -   -   -   -  -  -  -  -  -  -  -  -  -  -
d  -  -  -  -  +  -  -   -   -   -  -  -  +  +  -  -  -  -  -  -
g  -  -  -  -  +  +  -   -   -   -  -  -  -  -  -  -  -  -  -  -
ts -  -  +  -  -  -  +   -   -   -  -  -  -  -  -  -  -  -  -  -
tʃ -  -  +  -  -  -  -   +   -   -  -  -  -  -  -  -  -  -  -  -
dʒ -  -  -  -  +  -  -   -   +   -  -  -  -  -  -  -  -  -  -  -
f  -  +  -  -  -  -  -   -   -   +  -  -  -  -  -  -  -  -  -  -
s  -  +  +  -  -  -  -   -   -   -  +  -  -  -  -  -  -  -  -  -
ʃ  -  +  -  -  -  -  -   -   -   -  -  +  -  -  -  -  -  -  -  -
v  -  -  -  -  +  -  -   -   -   -  -  -  -  -  -  -  -  -  -  -
z  -  -  -  -  +  +  -   -   -   -  -  -  -  +  -  -  -  -  -  -
ʒ  -  -  -  -  +  -  -   -   -   -  -  -  -  -  -  -  -  -  -  -
m  +  +  -  -  +  -  -   -   -   +  -  -  +  +  +  +  -  -  -  -
n  -  +  +  -  +  -  +   +   +   -  +  +  +  -  -  -  +  +  -  -
l  +  +  +  +  +  +  +   +   -   +  -  +  +  -  -  +  -  +  -  -
r  +  +  +  +  +  +  +   +   -   +  +  +  +  +  +  +  +  +  +  +
j  +  +  +  -  +  +  +   +   -   +  +  +  +  +  +  +  +  +  -  -

# Words

# First, some basic syllable types, with clustering rules as defined
# above. 
# Note that all syllables have a leading quote mark, which defines
# syllable boundary, to make the cluster rules given above apply more
# precisely.

$A = 'CVV?C?
$B = 'VV?C?
$C = 'WXVV?C?

$D = 'DEVC?

$P = 'CVV?TT?
$Q = 'VV?TT?

# The actual words.
words: $P' $Q' $D $Q$P' $P$P' $A$A $C$A $C$P' $Q$D$P' $Q$A $Q$A$P' V?$A $B$A

# Reject a few vexations.
reject: j(i|í) j' h' h$ ʃs sʃ zʒ ʒz sz

# Hungarian-esque spelling
filter: ts > c; s > sz; tʃ > cs; ʒ > zs; ʃ > s; ss > s; ŋ > n

# Remove syllable boundaries.
filter: ' > !`;
    }

    if (choice == '' || choice == false || choice == null || choice == undefined) {
        return false;
    } else {
        return choice;
    }

}

export default getLexExample;