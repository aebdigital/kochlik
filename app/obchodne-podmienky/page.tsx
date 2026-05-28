import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryBar from '@/components/CategoryBar';
import { createMetadata } from '@/lib/seo';

export const metadata = createMetadata({
  title: 'Obchodné podmienky a reklamačný poriadok',
  description:
    'Všeobecné obchodné podmienky, objednávanie, platby a reklamačný poriadok pre zákazníkov KOCHLIK s.r.o.',
  path: '/obchodne-podmienky',
});

export default function TermsPage() {
  return (
    <>
      <Header />
      <CategoryBar />

      <main className="flex-1 bg-white">
        <section className="mx-auto w-full max-w-[85vw] px-4 py-24 sm:px-6 lg:max-w-[1150px]">
          <h1 className="mb-10 text-[42px] font-extrabold uppercase leading-tight text-[var(--color-brown)]">
            Všeobecné obchodné podmienky a reklamačný poriadok
          </h1>

          <div className="space-y-10 text-[18px] font-light leading-relaxed text-[#555]">
            <div className="space-y-4">
              <h2 className="text-[22px] font-extrabold uppercase tracking-wide text-[var(--color-brown)]">
                Čl. I — Všeobecné ustanovenia
              </h2>
              <p>Predávajúcim je podnikateľ:</p>
              <p className="text-[var(--color-brown)]">
                <strong className="font-extrabold">KOCHLIK s.r.o.</strong>
                <br />
                Sídlo: Kolískova 10 841 05 Bratislava – mestská časť Karlova Ves
                <br />
                Prevádzkareň: 81109 Bratislava-Staré Mesto, Ul. 29. augusta 28
                <br />
                IČO: 52750744
                <br />
                IČ DPH: SK2121156235
                <br />
                tel. číslo: 0905 587 986
                <br />
                e-mail: kochlik@kochlik.eu
                <br />
                Predávajúci je platcom DPH.
              </p>
              <p>
                Spoločnosť zapísaná v obchodnom registri Mestského súdu Bratislava III, oddiel: Sro, vložka č.: 142249/B. Číslo účtu pre bezhotovostné platby: SK92 0900 0000 0051 6717 7871 (ďalej len „predávajúci“).
              </p>
              <p>
                Predávajúci na základe požiadaviek svojich zákazníkov a to fyzických osôb – spotrebiteľov a iných fyzických osôb a právnických osôb zabezpečuje dodanie tovaru – kvetináčov a iných doplnkov zo živice, ktoré na základe ich individuálnych požiadaviek objednáva vždy jednotlivo od ich výrobcov. Tovar sa predáva zhotovený podľa osobitných požiadaviek kupujúceho, príp. vyrobený na mieru pre kupujúceho alebo je určený len pre jedného kupujúceho, ktorý si ho osobitne vyžiada, preto od objednávky, ktorá bola predávajúcim akceptovaná, nemožno odstúpiť, ak to zákon alebo individuálne dojednanie medzi predávajúcim a kupujúci výslovne neustanovuje.
              </p>
              <p>
                Kupujúcim je každá fyzická alebo právnická osoba, ktorá prejaví záujem o dodanie tovaru zo strany predávajúceho.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-[22px] font-extrabold uppercase tracking-wide text-[var(--color-brown)]">
                Čl. II — Objednávanie a vyjadrenie súhlasu s podmienkami
              </h2>
              <p>
                <strong className="font-extrabold text-[var(--color-brown)]">2.1</strong> Predávajúci pred uzatvorením zmluvy s kupujúcim primeraným spôsobom informuje o hlavných vlastnostiach tovaru, celkovej cene tovaru vrátane všetkých daní, nákladoch na dopravu, dodania, poštovného a iných nákladov.
              </p>
              <p>
                <strong className="font-extrabold text-[var(--color-brown)]">2.2</strong> Tovar môže kupujúci objednávať telefonicky, emailom alebo osobne. Zmluva, na základe ktorej má predávajúci dodať tovar kupujúcemu, sa považuje za uzatvorenú v prípade, ak predávajúci bez výhrad potvrdí prijatie objednávky zo strany kupujúceho alebo prípadne iným preukázateľným spôsobom sa predávajúci a kupujúci dohodnú na dodaní tovaru. Dodacia lehota je 3 – 6 týždňov od potvrdenia objednávky.
              </p>
              <p>
                <strong className="font-extrabold text-[var(--color-brown)]">2.3</strong> V prípade telefonickej alebo emailovej objednávky, predávajúci zašle kupujúcemu na ním určenú emailovú alebo v komunikácii s predávajúcim použitú emailovú adresu tieto všeobecné obchodné podmienky v prílohe emailu, pričom kupujúci je povinný emailom potvrdiť súhlas s obchodnými podmienkami, v opačnom prípade nie je predávajúci povinný dodať žiadaný tovar. V prípade osobnej objednávky kupujúci vyjadrí súhlas s týmito podmienkami svojim podpisom.
              </p>
              <p>
                Proces objednávania a komunikácie s kupujúcim prebieha v zásade slovenskom jazyku.
              </p>
              <p>
                <strong className="font-extrabold text-[var(--color-brown)]">2.5</strong> Pri osobnej objednávke sa objednávka realizuje v priestoroch predávajúceho uvedených vyššie, pričom pre odstránenie akýchkoľvek pochybností sa uvádza, že zmluva medzi predávajúcim a kupujúcim sa neuzatvára na mieste, ktoré nie je prevádzkovým priestorom predávajúceho; pričom nejde ani o zmluvu na ktorej uzavretie dal návrh predávajúcemu kupujúci na mieste, ktoré nie je prevádzkovým priestorom predávajúceho; zmluvu uzavretú v prevádzkových priestoroch predávajúceho alebo prostredníctvom prostriedkov diaľkovej komunikácie bezprostredne po individuálnom a osobnom oslovení kupujúceho predávajúcim na mieste, ktoré nie je prevádzkovým priestorom predávajúceho; zmluvu uzavretú počas predajnej akcie alebo v súvislosti s ňou.
              </p>
              <p>
                Predávajúci má právo zrušiť objednávku v prípade, keď nie je možné zabezpečiť dodanie tovaru z dôvodu jeho nedostupnosti, o čom bez zbytočného odkladu informuje kupujúceho. Kupujúci uvedené berie na vedomie a v prípade, ak k uvedenému dôjde, predávajúci do 7 dní od informovania o nedostupnosti tovaru vráti prípadne zaplatené platby za tovar.
              </p>
              <p>
                Predávajúci má právo zrušiť objednávku tiež v prípade, ak sa nemôže skontaktovať s kupujúcim (chybne uvedené alebo neuvedené kontaktné údaje, nedostupnosť, …).
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-[22px] font-extrabold uppercase tracking-wide text-[var(--color-brown)]">
                Čl. III — Reklamačný poriadok
              </h2>
              <p>
                <strong className="font-extrabold text-[var(--color-brown)]">3.1</strong> V prípade potreby je tovar potrebné písomne alebo emailom reklamovať na kontaktných údajoch uvedených v bode 1.1 a zaslať tovar na vlastné náklady na prevádzku predávajúceho, prípadne tovar reklamovať priamo na prevádzke predávajúceho. Predávajúci môže pri predchádzajúcej komunikácii s kupujúcim určiť, že tovar nie je potrebné zasielať, ale k vybaveniu reklamácie postačí vyjadrenie kupujúceho, prípadne písomne alebo emailom zaslaná reklamácia spolu aj s príslušnými fotografiami tovaru. Pri reklamácii tovaru je potrebné tovar primeraným spôsobom umyť, v prípade ak kupujúci predkladá tovar predávajúcemu. V mieste určenom podľa týchto všeobecných obchodných podmienok na prijímanie reklamácií je predávajúci povinný zabezpečiť prítomnosť osoby poverenej vybavovať reklamácie.
              </p>
              <p>
                Záručná doba je 24 mesiacov. Záručná doba začína plynúť dňom dodania tovaru. Počas záručnej doby má zákazník – spotrebiteľ právo na bezplatné odstránenie chyby po predložení tovaru vrátane príslušenstva, dokumentácie a návodu predávajúceho spolu s dokladom o zaplatení. Záručná doba sa predlžuje o dobu, počas ktorej kupujúci nemohol používať tovar z dôvodu záručnej opravy tovaru.
              </p>
              <p>
                Predávajúci alebo určená osoba vydá kupujúcemu – spotrebiteľovi potvrdenie o uplatnení reklamácie tovaru vo vhodnej forme zvolenej predávajúcim, napr. vo forme mailu alebo v písomnej podobe, v ktorej je povinný presne označiť chyby tovaru v súlade s ust. § 18 ods. 5 zákona č. 250/2007 o ochrane spotrebiteľa (ďalej len „Zákon“) a poučiť spotrebiteľa o jeho právach, ktoré mu vyplývajú z ust. § 622 a ust. § 623 Občianskeho zákonníka. Ak je reklamácia uplatnená prostredníctvom prostriedkov diaľkovej komunikácie, predávajúci je povinný potvrdenie o uplatnení reklamácie doručiť kupujúcemu ihneď; ak nie je možné potvrdenie doručiť ihneď, musí sa doručiť bez zbytočného odkladu, najneskôr však spolu s dokladom o vybavení reklamácie; potvrdenie o uplatnení reklamácie sa nemusí doručovať, ak kupujúci má možnosť preukázať uplatnenie reklamácie iným spôsobom.
              </p>
              <p>
                Reklamácia tovaru sa pri spotrebiteľovi riadi ustanoveniami Občianskeho zákonníka o zodpovednosti za vady predanej veci v zmysle § 619 a nasl. Občianskeho zákonníka, prípadne ďalšími právnymi predpismi vzťahujúcimi sa na ochranu spotrebiteľa. Kupujúci je povinný reklamovať chyby tovaru u predávajúceho bez zbytočného odkladu, inak kupujúcemu zaniká právo voči predávajúcemu na bezplatné odstránenie chyby. Ak ide o vadu, ktorú možno odstrániť, má kupujúci právo, aby bola bezplatne, včas a riadne odstránená. Predávajúci je povinný vadu bez zbytočného odkladu odstrániť. Kupujúci môže namiesto odstránenia vady požadovať výmenu veci, alebo ak sa vada týka len súčasti veci, výmenu súčasti, ak tým predávajúcemu nevzniknú neprimerané náklady vzhľadom na cenu tovaru alebo závažnosť vady. Predávajúci môže vždy namiesto odstránenia vady vymeniť vadnú vec za bezvadnú, ak to kupujúcemu nespôsobí závažné ťažkosti. Ak ide o vadu, ktorú nemožno odstrániť a ktorá bráni tomu, aby sa vec mohla riadne užívať ako vec bez vady, má kupujúci právo na výmenu veci alebo má právo od zmluvy odstúpiť. Tie isté práva prislúchajú kupujúcemu, ak ide síce o odstrániteľné vady, ak však kupujúci nemôže pre opätovné vyskytnutie sa vady po oprave alebo pre väčší počet vád vec riadne užívať. Ak ide o iné neodstrániteľné vady, má kupujúci právo na primeranú zľavu z ceny veci.
              </p>
              <p>
                Na základe rozhodnutia kupujúceho – spotrebiteľa, ktoré zo svojich práv v zmysle ust. § 622 a ust. § 623 Občianskeho zákonníka uplatňuje, je predávajúci alebo určená osoba povinná určiť spôsob vybavenia reklamácie podľa ust. § 2 písm. m) Zákona ihneď, v zložitejších prípadoch do 3 dní od začiatku reklamačného konania, v odôvodnených prípadoch, najmä ak sa vyžaduje zložité technické zhodnotenie stavu tovaru, najneskôr do 30 dní odo dňa začiatku reklamačného konania. Po určení spôsobu vybavenia reklamácie predávajúci alebo určená osoba reklamáciu vybaví ihneď, v odôvodnených prípadoch možno reklamáciu vybaviť aj neskôr. Vybavenie reklamácie však nesmie trvať dlhšie ako 30 dní odo dňa uplatnenia reklamácie. Po uplynutí lehoty na vybavenie reklamácie má spotrebiteľ právo od zmluvy odstúpiť alebo má právo na výmenu tovaru za nový tovar. O ukončení reklamačného konania a výsledku reklamácie informuje predávajúci kupujúceho formou dohodnutou medzi obidvoma zmluvnými stranami (e-mailom a doporučeným listom) a zároveň bude kupujúcemu spolu s tovarom doručený reklamačný protokol. Ak kupujúci reklamáciu tovaru uplatnil počas prvých 12 mesiacov od uzavretia kúpnej zmluvy, môže predávajúci vybaviť reklamáciu zamietnutím len na základe vyjadrenia znalca alebo stanoviska vydaného autorizovanou, notifikovanou alebo akreditovanou osobou alebo stanoviska určenej osoby (ďalej len „odborné posúdenie tovaru“). Bez ohľadu na výsledok odborného posúdenia nemôže predávajúci od kupujúceho vyžadovať úhradu nákladov na odborné posúdenie tovaru ani iné náklady súvisiace s odborným posúdením tovaru. Ak kupujúci reklamáciu výrobku uplatnil po 12 mesiacoch od uzavretia kúpnej zmluvy a predávajúci ju zamietol, osoba, ktorá reklamáciu vybavila, je povinná v doklade o vybavení reklamácie uviesť, komu môže kupujúci zaslať tovar na odborné posúdenie. Ak kupujúci tovar zašle na odborné posúdenie určenej osobe uvedenej v doklade o vybavení reklamácie, náklady odborného posúdenia tovaru, ako aj všetky ostatné s tým súvisiace účelne vynaložené náklady znáša predávajúci bez ohľadu na výsledok odborného posúdenia. Ak kupujúci odborným posúdením preukáže zodpovednosť predávajúceho za reklamovanú chybu tovaru, môže reklamáciu uplatniť znova; počas vykonávania odborného posúdenia tovaru záručná doba neplynie. Predávajúci je povinný kupujúcemu uhradiť do 14 dní odo dňa znova uplatnenej reklamácie všetky náklady vynaložené na odborné posúdenie tovaru, ako aj všetky s tým súvisiace účelne vynaložené náklady. Znova uplatnenú reklamáciu nemožno zamietnuť.
              </p>
              <p>
                Predávajúci upozorňuje, že za vadu tovaru sa nepovažuje, ak odtieň farby dodaného tovaru sa líši od odtieňu tovaru zobrazenom na výstupnom zariadení kupujúceho (monitore, vytlačenom podklade z internetovej stránky predávajúceho), ktoré môže zobrazený odtieň farby skreslovať oproti skutočnosti.
              </p>
              <p>
                Predávajúci upozorňuje, že tovar – kvetináče sa môžu svojim tvarom prispôsobiť obsahu, ktorým sú naplnené a mierna deformácia v rozsahu od pôvodného tvaru tovar nepredstavuje vadu tovaru. Týka sa to hlavne väčších hrantíkov.
              </p>
              <p>
                Záruka sa nevzťahuje na bežné opotrebenie veci (alebo ich častí) spôsobené používaním. Kratšiu životnosť výrobku teda nemožno považovať za vadu a nedá sa ani reklamovať.
              </p>
              <p>
                <strong className="font-extrabold text-[var(--color-brown)]">3.7</strong> Predávajúci je povinný vybaviť reklamáciu a ukončiť reklamačné konanie jedným z nasledujúcich spôsobov:
              </p>
              <ul className="ml-6 list-disc space-y-2">
                <li>odovzdaním opraveného tovaru,</li>
                <li>výmenou tovaru,</li>
                <li>vrátením kúpnej ceny tovaru,</li>
                <li>vyplatením primeranej zľavy z ceny tovaru,</li>
                <li>písomnou výzvou na prevzatie predávajúcim určeného plnenia,</li>
                <li>odôvodneným zamietnutím reklamácie tovaru.</li>
              </ul>
              <p>
                Predávajúci je povinný o spôsobe určenia spôsobu vybavenia reklamácie a o vybavení reklamácie kupujúcemu vydať písomný doklad najneskôr do 30 dní odo dňa uplatnenia reklamácie prostredníctvom poskytovateľa poštovej alebo kuriérskej alebo donáškovej služby, alebo prostredníctvom e-mailu alebo na mieste pri osobnom uplatnení reklamácie.
              </p>
              <p>
                Na kontaktných údajoch predávajúceho uvedených v bode 1.1 sa možno obrátiť s akoukoľvek sťažnosťou a podnetom, pričom predávajúci bez zbytočného odkladu, najneskôr však do 30 dní, prípadne v inej zákonom stanovenej lehote, na sťažnosť či podnet odpovie.
              </p>
              <p>
                V prípade, že kupujúci – spotrebiteľ nebol spokojný s vybavením reklamácie predávajúcim alebo keď sa kupujúci – spotrebiteľ obrátil na predávajúceho so žiadosťou o nápravu a nebol spokojný so spôsobom, ktorým predávajúci vybavil jeho reklamáciu alebo ak sa domnieva, že predávajúci porušil jeho práva, má kupujúci – spotrebiteľ právo obrátiť sa na predávajúceho so žiadosťou o nápravu. Ak predávajúci na takúto žiadosť odpovie zamietavo alebo na ňu neodpovie do 30 dní odo dňa jej odoslania, má kupujúci – spotrebiteľ právo podať návrh na začatie alternatívneho riešenia sporu subjektu alternatívneho riešenia sporov. Subjektom alternatívneho riešenia sporov je „Slovenská obchodná inšpekcia, Prievozská 32, P.O. Box 5, 820 07 Bratislava 27“ resp. iná príslušná oprávnená právnická osoba zapísaná v zozname subjektov alternatívneho riešenia sporov vedenom Ministerstvom hospodárstva Slovenskej republiky (zoznam je dostupný na stránke http://www.mhsr.sk). Kupujúci – spotrebiteľ je oprávnený si vybrať subjekt alternatívneho riešenia spotrebiteľských sporov na ktorý sa obráti.
              </p>
              <p>
                V prípade, že predávajúci ukončí reklamačné konanie ako odôvodnené zamietnutie reklamácie, ale chyba výrobku objektívne jestvuje a nebola odstránená, môže si kupujúci uplatniť svoje právo na odstránenie chyby tovaru prostredníctvom súdu.
              </p>
              <p>
                Pri kupujúcom, ktorý nemá postavenie spotrebiteľa, sa reklamácia vád tovaru neriadi ustanoveniami tohto článku všeobecných obchodných podmienok, ale ustanoveniami § 422 a nasl. Obchodného zákonníka, pričom kupujúci je upozornený, že vady tovaru je potrebné písomne alebo e-mailom reklamovať bez zbytočného odkladu a do 8 dní od dodania tovaru, v prípade ak ide o vadu, ktorú má mať tovar pri dodaní.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-[22px] font-extrabold uppercase tracking-wide text-[var(--color-brown)]">
                Čl. IV — Platby
              </h2>
              <p>
                <strong className="font-extrabold text-[var(--color-brown)]">4.1</strong> Na základe odoslanej objednávky vystaví predávajúci kupujúcemu faktúru, ktorú mu zašle emailom alebo písomne poštou. Túto platbu môže kupujúci uskutočniť nasledovne:
              </p>
              <ul className="ml-6 list-[lower-alpha] space-y-2">
                <li>prevodným príkazom zo svojho účtu,</li>
                <li>priamym vkladom v hotovosti na účet predávajúceho,</li>
                <li>iným medzi zmluvnými stranami dohodnutým spôsobom.</li>
              </ul>
              <p>
                <strong className="font-extrabold text-[var(--color-brown)]">4.2</strong> Doručenú faktúru je potrebné, aby si kupujúci skontroloval a v prípade chýb kontaktoval predávajúceho ohľadom opravy.
              </p>
              <p>
                <strong className="font-extrabold text-[var(--color-brown)]">4.3</strong> Kupujúci je poučený o tom, že predávajúci môže požadovať zaplatenie kúpnej ceny pred dodaním tovaru, prípadne môže požadovať preddavok v ním určenej výške.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-[22px] font-extrabold uppercase tracking-wide text-[var(--color-brown)]">
                Čl. V — Ochrana osobných údajov
              </h2>
              <p>
                <strong className="font-extrabold text-[var(--color-brown)]">5.1</strong> Všetky osobné údaje poskytnuté v rámci objednávky služieb prostredníctvom emailovej komunikácie sú zhromažďované, spracovávané a uchovávané v súlade so zákonom č. 122/2013 Z.z. o ochrane osobných údajov.
              </p>
              <p>
                <strong className="font-extrabold text-[var(--color-brown)]">5.2</strong> Odoslaním objednávky dáva kupujúci v súlade so zák. č. 122/2013 Z.z. súhlas predávajúcemu so spracovaním, zhromažďovaním a uchovávaním jeho osobných údajov pre účely uzavretia zmluvy, vybavenia objednávok a súvisiacej komunikácie s kupujúcim, ale aj po úspešnom vybavení objednávky pre účely plnenia zo zmluvy a vedenie príslušnej evidencie (napr. pri vybavovaní reklamácií, vedení účtovníctva a pod.), a to až do doby jeho písomného vyjadrenia nesúhlasu s týmto spracovaním. Osobné údaje sú spracované v rozsahu: meno, priezvisko, adresa, telefón, e-mail. Predávajúci neposkytuje, nezverejňuje a nesprístupňuje osobné údaje kupujúcich žiadnej ďalšej osobe.
              </p>
              <p>
                <strong className="font-extrabold text-[var(--color-brown)]">5.3</strong> Súhlas so spracovaním osobných údajov a zasielaním obchodných informácií je udelený na dobu neurčitú a je možné ho kedykoľvek zdarma odvolať výslovným a určitým prejavom v písomnej forme adresovanej predávajúcemu, a to poštou, telefonicky alebo elektronicky na e-mail kochlik@nextra.sk
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-[22px] font-extrabold uppercase tracking-wide text-[var(--color-brown)]">
                Čl. VI — Záverečné ustanovenia
              </h2>
              <p>
                Individuálne písomne alebo emailom zaznamenané dojednania medzi predávajúcim a kupujúcim majú prednosť pred ustanoveniami týchto všeobecných obchodných podmienok.
              </p>
              <p>
                Právne vzťahy medzi predávajúcim a kupujúcim sa riadia právnymi predpismi platnými v Slovenskej republike a to najmä Obchodným zákonníkom, v príp. fyzických osôb – spotrebiteľov Občianskym zákonníkom a ďalšími právnymi predpismi.
              </p>
              <p>
                Dozor a dohľad nad činnosťou predávajúceho vykonáva Slovenská obchodná inšpekcia – adresa, na ktorú sa možno obrátiť:
              </p>
              <p className="text-[var(--color-brown)]">
                Ústredný inšpektorát
                <br />
                Slovenskej obchodnej inšpekcie
                <br />
                poštový priečinok 29
                <br />
                Prievozská 32
                <br />
                827, Bratislava 27
              </p>
              <p>
                Pre doručovanie elektronických správ adresovaných kupujúcemu platí, že ak predávajúci neobdrží chybové hlásenie o nemožnosti doručenia správy (e-mailu, SMS) na poskytnutú adresu, považuje sa táto správa za doručenú na ďalší deň od jej odoslania. Pre doručovanie elektronických správ adresovaných predávajúcemu platí, že elektronická písomnosť sa považuje za nedoručenú do momentu, kým jej prijatie predávajúci nepotvrdí kupujúcemu spätnou správou (e-mail, SMS). Zásielka sa považuje za doručenú aj v prípade, ak ju adresát odmietne prevziať, alebo aj v prípade, že si ju adresát vlastným zavinením alebo opomenutím neprevezme. V takom prípade sa považuje za doručenú uplynutím úložnej doby na pošte v trvaní podľa určenia odosielateľa a vrátením zásielky odosielateľovi, o čom musí odosielateľ preukázať relevantný dôkaz. Strana, ktorá zmení svoje kontaktné údaje, je o tom povinná informovať druhú stranu, v opačnom prípade druhá strana nezodpovedá za to, že jej správa či zásielka nebola doručená.
              </p>
              <p>
                Ak sa preukáže, že niektoré z ustanovení týchto podmienok je neplatné alebo neúčinné, nemá takáto neplatnosť alebo neúčinnosť za následok neplatnosť alebo neúčinnosť ďalších ustanovení týchto podmienok. V takomto prípade sa strany zaväzujú bezodkladne nahradiť takéto neplatné alebo neúčinné ustanovenie novým tak, aby bol zachovaný účel, sledovaný príslušným neplatným či neúčinným ustanovením v čase jeho prijatia.
              </p>
              <p>
                Podmienky sú platné a zaväzujú odo dňa ich zverejnenia na internetovej stránke predávajúceho a je možné do nich nahliadnuť aj v miestne podnikania predávajúceho. Predávajúci si vyhradzuje právo podľa vlastného uváženia ich rušiť, meniť, upravovať alebo nahrádzať novými.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
