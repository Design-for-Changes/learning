import { Section, Prompt } from './Common.jsx';
const tools=[
 ['画面で操作する','jamovi / JASP','表を読み込み、メニューで解析を選ぶ。基本的な検定や回帰などを、コードを書かずに試せる。','使いたい手法やモデル、オプションが用意されているかを確認する。設定と結果を一緒に保存する。',[['jamovi','https://www.jamovi.org/'],['JASP','https://jasp-stats.org/features/']]],
 ['表計算で行う','Excel','データの確認や集計、図の作成、分析ツールによる基本的な統計解析に使う。','データ整理には手軽だが、複雑なモデルや繰り返し処理には別の道具が適することもある。セルの操作履歴だけで解析を再現できるかに注意する。',[['Microsoft：分析ツール','https://support.microsoft.com/ja-jp/excel/use-the-analysis-toolpak-to-perform-complex-data-analysis']]],
 ['統計ソフトを使う','SPSS / JMP','専用の画面で、集計・可視化・統計モデルの設定や結果の確認を行う。','大学の利用環境やライセンス、必要な追加機能を確認する。画面操作でも、選んだ設定の意味を理解する必要がある。',[['IBM SPSS Statistics','https://www.ibm.com/products/spss-statistics'],['JMP','https://www.jmp.com/']]],
 ['コードで行う','Python','ライブラリを組み合わせて、前処理・可視化・統計解析・予測まで実行する。同じ処理を繰り返す、AIと相談しながらコードを作る、といった進め方に向く。','Pythonそのものに全手法が入っているわけではない。下の一覧から、処理に合うライブラリを使う。',[['Python','https://www.python.org/'],['ライブラリの公式資料','https://docs.scipy.org/doc/scipy/reference/stats.html']]],
 ['コードで行う','R','統計解析のための言語と環境。分野ごとのパッケージや、既存の研究コードを利用して解析を組み立てる。','共同研究者や研究分野の蓄積も選ぶ材料になる。Rで整った手法を、無理に別の言語へ移す必要はない。',[['R Project','https://www.r-project.org/'],['CRANの分野別一覧','https://cran.r-project.org/web/views/']]],
];
const libraries=[
 ['NumPy','数値計算の土台','配列、行列、乱数などを扱う。シミュレーションや数式に沿った計算。','https://numpy.org/doc/stable/'],
 ['pandas','表を読み、整える','CSVの読み込み、列の変換、欠測の確認、グループごとの集計。','https://pandas.pydata.org/docs/'],
 ['SciPy / scipy.stats','分布・検定を計算する','確率分布、t検定、順位検定、相関など。関数が対応あり／なしのどちらかを確認する。','https://docs.scipy.org/doc/scipy/reference/stats.html'],
 ['statsmodels','統計モデルを推定する','回帰、一般化線形モデル、混合効果モデルなど。係数・標準誤差・信頼区間・診断を調べる。','https://www.statsmodels.org/stable/index.html'],
 ['scikit-learn','予測や構造の探索','回帰・分類・PCA・クラスター分析、前処理、交差検証。係数のp値を読む統計ソフトと役割が同じとは限らない。','https://scikit-learn.org/stable/user_guide.html'],
 ['Matplotlib / seaborn','図で確かめる','散布図、ヒストグラム、箱ひげ図など。Matplotlibで細かく調整し、seabornで統計的な図を組み立てる。','https://seaborn.pydata.org/'],
 ['Prince','対応分析など','対応分析（CA）・多重対応分析（MCA）などの探索的な多変量解析。入力する表の形を確認する。','https://maxhalford.github.io/prince/'],
 ['semopy','関係の構造をモデル化する','構造方程式モデリング（SEM）。測定モデルや仮説を先に考える。','https://semopy.com/'],
 ['PyMC','ベイズモデルを組み立てる','事前分布とデータから事後分布を推定する。モデルの設定とサンプリングの診断も必要。','https://www.pymc.io/'],
];
export default function ToolsLesson(){return <><p className="eyebrow">07 / 統計解析を実施する方法</p><h1>統計解析を実施する方法</h1><p className="lede">同じ解析でも、画面で操作する方法と、コードを書く方法があります。知りたいこととデータを整理した上で、必要な手法を実行できる道具を選びます。</p>
 <Section title="実施する方法の一覧"><div className="reference-list">{tools.map(([kind,name,body,note,links])=><article key={name}><span className="eyebrow">{kind}</span><h3>{name}</h3><p>{body}</p><p className="tool-detail">{note}</p><div className="source-links">{links.map(([label,url])=><a href={url} key={url} target="_blank" rel="noreferrer">{label} ↗</a>)}</div></article>)}</div></Section>
 <Section title="Pythonでは、ライブラリを組み合わせる"><p>ライブラリは、よく使う処理をまとめた道具箱です。例えば、pandasで表を読み、図で確認し、SciPyで検定する。複数の要因を一緒に扱うならstatsmodels、未知のデータへの予測を比較するならscikit-learn、と役割を分けて使います。</p><div className="reference-list libraries">{libraries.map(([name,role,body,url])=><article key={name}><h3>{name}</h3><strong>{role}</strong><p>{body}</p><a href={url} target="_blank" rel="noreferrer">公式資料 ↗</a></article>)}</div><p>有名なライブラリだからといって、自分の設計に必要な手法がすべて入っているとは限りません。対応のある検定か、どの推定方法か、欠測をどう扱うかなど、関数の仕様を公式資料で確認します。</p></Section>
 <Section title="Pythonを動かす場所"><div className="reference-list"><article><h3>Google Colab</h3><p>ブラウザー上のノートでPythonを実行する。手元の環境を整える前に、短いコードや図を試したいときの入口になります。</p><a href="https://research.google.com/colaboratory/faq.html">Colabの説明 ↗</a></article><article><h3>Jupyter Notebook / JupyterLab</h3><p>コード・文章・実行結果をノートにまとめる。手元や用意した計算環境で、過程を残しながら解析するための環境です。</p><a href="https://jupyter.org/">Jupyter ↗</a></article><article><h3>エディターとPython実行環境</h3><p>処理をスクリプトにして保存し、繰り返し実行する。環境とライブラリのバージョンも記録しておきます。</p><a href="https://docs.python.org/3/tutorial/venv.html">実行環境の管理 ↗</a></article></div><p>ColabやJupyterは、解析手法やライブラリの名前ではありません。「どこでPythonを動かすか」の選択肢です。</p></Section>
 <Section title="AIには、道具の選び方から聞く"><p>コードを頼む前に、使いたい手法とデータの構造を伝えます。ライブラリ名だけで依頼せず、「同じ人の繰り返し測定を扱えるか」「出力から何が読めるか」も確認しましょう。</p><Prompt text={'次の統計解析を実施する方法を比較してください。\n知りたいこと：【記入】\n検討している手法：【記入】\nデータの形・対象数・対応や繰り返し測定：【記入】\n使える環境：【例：ブラウザー、Python、R、大学の統計ソフト】\nGUIで操作する方法とコードで行う方法を比較してください。Pythonの場合は、どのライブラリのどの機能を使うか、公式資料へのリンクとともに説明してください。必要なオプションや前提、再現のために保存するものも示してください。手法がデータに合うか不明なら、先に質問してください。'}/></Section>
 <Section title="手を動かしてみたいとき"><p>画面A・Bの架空データで、図を描き、平均差を検討する練習も用意しています。</p><a className="next-link" href="#/statistics/python">Pythonの練習例へ →</a></Section>
 </>;}
