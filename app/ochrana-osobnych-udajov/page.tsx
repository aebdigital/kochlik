import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryBar from '@/components/CategoryBar';
import { createMetadata } from '@/lib/seo';

export const metadata = createMetadata({
  title: 'Ochrana osobných údajov',
  description:
    'Informácie o spracovaní a ochrane osobných údajov spoločnosti KOCHLIK s.r.o. v Bratislave.',
  path: '/ochrana-osobnych-udajov',
});

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <CategoryBar />

      <main className="flex-1 bg-white">
        <section className="site-container max-w-[1100px] py-24">
          <h1 className="mb-10 text-[42px] font-extrabold uppercase leading-tight text-[var(--color-brown)]">
            Ochrana osobných údajov
          </h1>

          <div className="space-y-8 text-[18px] font-light leading-relaxed text-[#555]">
            <div>
              <h2 className="mb-3 text-[20px] font-extrabold uppercase tracking-wide text-[var(--color-brown)]">
                Základné zhrnutie
              </h2>
              <p>
                Spoločnosť kochlik vykonáva spracovanie Vašich osobných údajov, pretože je to nevyhnutné pre výkon zmluvy s Vami ohľadom predaja tovaru (alebo pre prijali opatrenia pred uzatvorením takejto zmluvy), a ďalej vykonáva spracovanie Vašich osobných údajov, ktoré je nevyhnutné pre plnenie verejnoprávnych povinností tejto spoločnosti.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-[20px] font-extrabold uppercase tracking-wide text-[var(--color-brown)]">
                1. Totožnosť a kontaktné údaje správcu
              </h2>
              <p>
                <strong className="font-extrabold text-[var(--color-brown)]">1.1.</strong> Správcom Vašich osobných údajov je firma KOCHLIK s.r.o. so sídlom Kolískova 10, 841 05 Bratislava, prevádzka na ulici 29. augusta 28, 811 09 Bratislava, identifikačné číslo: 52 750 744 spoločnosť zapísaná v obchodnom registri Mestského súdu Bratislava III, oddiel: Sro, vložka č.: 142249/B, ďalej len „správca“.
              </p>
              <p>
                <strong className="font-extrabold text-[var(--color-brown)]">1.2.</strong> Kontaktné údaje správcu sú nasledujúce: adresa pre doručovanie Kolískova 10 Bratislava – mestská časť Karlova Ves 841 05, adresa elektronickej pošty kochlik@kochlik.eu, tel. 0905 587 986
              </p>
              <p>
                <strong className="font-extrabold text-[var(--color-brown)]">1.3.</strong> Správca nemenoval poverenca pre ochranu osobných údajov.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-[20px] font-extrabold uppercase tracking-wide text-[var(--color-brown)]">
                2. Právny základ spracovania osobných údajov
              </h2>
              <p>
                <strong className="font-extrabold text-[var(--color-brown)]">2.1.</strong> Právnym základom spracovanie Vašich osobných údajov je skutočnosť, že toto spracovanie je nevyhnutné pre:
              </p>
              <p>
                <strong className="font-extrabold text-[var(--color-brown)]">2.1.1.</strong> plnenie zmluvy medzi Vami a prevádzkovateľom alebo na vykonanie opatrení správcom pred uzavretím takejto zmluvy v zmysle čl. 6 ods. 1 písm. b) Nariadenie Európskeho parlamentu a Rady 2016/679 o ochrane fyzických osôb pri spracovaní osobných údajov a o voľnom pohybe týchto údajov a o zrušení smernice 95/46/ES (všeobecné nariadenie o ochrane osobných údajov) (ďalej len „nariadenie“);
              </p>
              <p>
                <strong className="font-extrabold text-[var(--color-brown)]">2.1.2.</strong> splnenie právnych povinností, ktoré sa na správcu vzťahujú, v zmysle čl. 6 ods. 1 písm. c) nariadenia, a to konkrétne najmä splnenie povinností uložených správcovi všeobecne záväznými právnymi predpismi, najmä zákonom č. 235/2004 Zb. o dani z pridanej hodnoty v znení neskorších predpisov, zákonom č. 586/1992 Zb. o daniach z príjmov v znení neskorších predpisov, a zákonom č. 563/1991 Zb. o účtovníctve v znení neskorších predpisov.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-[20px] font-extrabold uppercase tracking-wide text-[var(--color-brown)]">
                3. Účely spracovania osobných údajov
              </h2>
              <p>
                <strong className="font-extrabold text-[var(--color-brown)]">3.1.</strong> Účelom spracovania Vašich osobných údajov je plnenie zmluvy medzi Vami a správcom, vrátane doručenia tovaru a riešenie práv zo zodpovednosti za vady, či prevedenie opatrení správcom pred uzatvorením takejto zmluvy a ďalej plnenie súvisiacich verejnoprávnych povinností správcom.
              </p>
              <p>
                <strong className="font-extrabold text-[var(--color-brown)]">3.2.</strong> Zo strany správcu nedochádza k automatickému individuálnemu rozhodovanie v zmysle čl. 22 nariadenia.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-[20px] font-extrabold uppercase tracking-wide text-[var(--color-brown)]">
                4. Doba uloženia osobných informácií
              </h2>
              <p>
                <strong className="font-extrabold text-[var(--color-brown)]">4.1.</strong> Vaše osobné údaje budú spracovávané po dobu trvania účinkov práv a povinností zo zmluvy a ďalej po dobu nutnú na účely archivovanie podľa príslušných všeobecne záväzných právnych predpisov, najdlhšie však po dobu stanovenú všeobecne záväznými právnymi predpismi.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-[20px] font-extrabold uppercase tracking-wide text-[var(--color-brown)]">
                5. Ďalšie príjemcovia údajov
              </h2>
              <p>
                <strong className="font-extrabold text-[var(--color-brown)]">5.1.</strong> Ďalšími príjemcami Vašich osobných údajov budú zasielateľskej spoločnosti a iné osoby podieľajúce sa na dodanie tovaru či realizáciu platieb na základe kúpnej zmluvy, a osoby zaisťujúce pre správcov technické služby súvisiace s prevádzkou kamenného obchodu, vrátane prevádzky softvér a ukladanie dát. Ďalej odovzdávame iba v nevyhnutnej miere Vaše meno, priezvisko, telefón a e-mail našim dodávateľským firmám, ktoré sú v zahraničí, pre vybavenie objednávok expedovaných priamo zo skladu dodávateľov, ktorí Vaše osobné údaje dostávajú jednorazovo len za účelom expedície objednávky a nemajú právo akokoľvek ďalej Vaše osobné údaje spracovávať alebo ukladať.
              </p>
              <p>
                <strong className="font-extrabold text-[var(--color-brown)]">5.2.</strong> Príjemcovia Vašich osobných údajov spracovaných za účelom plnenia povinností vyplývajúcich z právnych predpisov môžu byť ďalej orgány finančnej správy či iné príslušné úrady v prípadoch, keď tak správcovia ukladajú všeobecne záväzné právne predpisy.
              </p>
              <p>
                <strong className="font-extrabold text-[var(--color-brown)]">5.3.</strong> Správca nemá v úmysle odovzdať Vaše osobné údaje do tretej krajiny (do krajiny mimo EÚ) alebo medzinárodnej organizácii.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-[20px] font-extrabold uppercase tracking-wide text-[var(--color-brown)]">
                6. Práva dotknutej osoby
              </h2>
              <p>
                <strong className="font-extrabold text-[var(--color-brown)]">6.1.</strong> Za podmienok stanovených v nariadení máte právo požadovať od správcu prístup k Vašim osobným údajom, právo na opravu alebo vymazanie Vašich osobných údajov, prípadne obmedzenie ich spracovania, právo namietať proti spracovaniu Vašich osobných údajov a ďalej právo na prenosnosť Vašich osobných údajov.
              </p>
              <p>
                <strong className="font-extrabold text-[var(--color-brown)]">6.2.</strong> Ak by ste sa domnieval(a), že spracovaním Vašich osobných údajov bolo porušené alebo je porušované nariadenia, máte okrem iného právo podať sťažnosť u dozorného úradu.
              </p>
              <p>
                <strong className="font-extrabold text-[var(--color-brown)]">6.3.</strong> Nemáte povinnosť osobné údaje poskytnúť. Poskytnutie Vašich osobných údajov je nutným požiadavkou pre uzatvorenie a plnenie zmluvy a bez poskytnutia Vašich osobných údajov nie je možné zmluvu uzavrieť či ju zo strany správcu splniť.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
