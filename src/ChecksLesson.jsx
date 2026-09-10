import { useState } from 'react';
import { Section, Prompt } from './Common.jsx';
import { correlatedPoints, twoPredictorVIF, regression } from './math.js';
function CollinearityExplorer(){
 const [r,setR]=useState(.3), points=correlatedPoints(r),actual=regression(points).r;
 const sx=x=>300+x*32,sy=y=>150-y*17;
 return <div className="explorer"><div className="explorer-heading"><h3>説明変数同士が似てくると？</h3><span>説明変数が2つの場合</span></div>
 <svg className="plot" viewBox="0 0 600 310" role="img" aria-label={`架空の2つの説明変数。相関${actual.toFixed(2)}、VIFは${twoPredictorVIF(actual).toFixed(2)}`}><line x1="60" x2="540" y1="270" y2="270" className="axis"/><line x1="60" x2="60" y1="24" y2="270" className="axis"/><text x="68" y="25">説明変数2</text><text x="440" y="298">説明変数1</text>{points.map(([x,y],i)=><circle key={i} cx={sx(x)} cy={sy(y)} r="6" fill="#cc2939"/>)}</svg>
 <label className="control">説明変数間の相関：{r.toFixed(2)}<input type="range" min="0" max="0.99" step="0.01" value={r} onChange={e=>setR(+e.target.value)}/></label>
 <div className="metric-row"><span>VIF <strong>{twoPredictorVIF(actual).toFixed(2)}</strong></span></div>
 <p className="explainer">説明変数が2つならVIF = 1 / (1 − r²)です。相関が0.99になると約50になります。説明変数が3つ以上ある場合は、2変数ずつの相関だけでは見落とすことがあります。</p>
 </div>;
}
const cautions=[
 ['独立性・対応','同じ人の10回の測定を、10人分として数えない。誰を、何回、どの集団で測ったかを確認する。','mixed','対応・繰り返し測定'],
 ['分布・残差','正規性などの仮定が、元の値・差・誤差のどれに関するものかを区別する。ヒストグラムやQ–Qプロット、残差の図を見る。',null,'分布と確率の基礎'],
 ['多重共線性','説明変数同士に強い線形関係があると、係数の推定が不安定になりうる。変数の意味、相関、VIFを確認する。','regression','重回帰分析'],
 ['外れ値・欠測','入力間違いか、重要な観察かを調べる。有意差を出すために削除しない。除外基準と欠測処理を記録し、結論への影響を調べる。','describe','データの確認'],
 ['多重比較','比較を増やすと、誤って有意になる結果も出やすい。検証する問いを先に決め、目的に合う多重性の調整を考える。','anova','条件の比較'],
 ['過学習・情報漏洩','同じデータに合わせるほど、新しいデータで当たるとは限らない。前処理も含め、学習用と評価用を分ける。','forest','予測モデル'],
 ['標準化・距離','単位の大きい項目が結果を支配することがある。標準化や、何を「似ている」と呼ぶかを先に検討する。','pca','主成分分析'],
 ['効果の大きさ・解釈','p値だけで結論を決めない。差や関係の大きさ、不確かさ、対象への一般化、因果関係と言えるかを考える。','paired','差と信頼区間'],
];
export default function ChecksLesson(){return <><p className="eyebrow">05 / 解析前後の確認</p><h1>解析で注意すること</h1><p className="lede">ソフトが結果を返しても、その解析がデータに合っているとは限りません。何を仮定して、何を確かめる必要があるのかを整理しておきましょう。</p>
 <Section title="まず押さえておく注意点"><div className="reference-list">{cautions.map(([name,body,id,label])=><article key={name}><h3>{name}</h3><p>{body}</p><a href={id?`#/statistics/method/${id}`:'#/statistics/basics'}>{label} →</a></article>)}</div></Section>
 <Section title="多重共線性って、何？"><p>椅子の価格を、幅や奥行きから説明したいとします。幅の広い椅子は奥行きも大きい、といった強い関係があると、価格との関係を幅と奥行きそれぞれにどう割り振るかが難しくなります。</p><p>このように、説明変数同士に強い線形関係がある状態が<strong>多重共線性</strong>です。回帰係数の標準誤差が大きくなったり、少しデータを変えただけで係数の大きさや符号が変わったりします。幅をcmとmmの両方で入れるような完全な重複では、係数を一意に決められません。</p><CollinearityExplorer/><p>VIFは、通常の線形回帰で、共線性によって係数の推定の分散がどれだけ膨らむかを表す指標です。ある説明変数をほかの説明変数でどれだけ説明できるかから計算します。値が大きいことは確認のきっかけになりますが、「5や10を超えたら必ず削除」という機械的なルールではありません。</p><p><strong>係数を解釈したいのか、予測したいのか</strong>で対処は変わります。測っている内容に基づいて変数を整理する、指標をまとめる、リッジ回帰などを検討する方法があります。予測が安定する場合でも、個々の係数を原因の強さとして読めるとは限りません。</p></Section>
 <Section title="手法ごとに、仮定するものが違う"><div className="table-scroll"><table className="data-table"><thead><tr><th>手法</th><th>主に確かめること</th></tr></thead><tbody>
 <tr><th>Welchのt検定</th><td>2群と観測の独立性。小標本では分布や極端な値の影響。等分散は仮定しない。</td></tr>
 <tr><th>対応のあるt検定</th><td>対応する組を保つ。対象間の独立性と、個人内の差の分布を確認する。</td></tr>
 <tr><th>通常の線形回帰</th><td>条件付き平均の形、誤差の独立性、多重共線性、影響の大きい観測。通常の標準誤差には等分散、小標本での正確な検定には誤差の正規性も関わる。</td></tr>
 <tr><th>ロジスティック回帰</th><td>結果の符号化、説明変数と対数オッズの関係、観測の独立性、少数の事例や完全分離。目的変数の正規性は仮定しない。</td></tr>
 <tr><th>PCA・クラスター分析</th><td>単位・標準化、外れ値、使う項目。軸やグループを元のデータに戻って解釈する。</td></tr>
 </tbody></table></div><p>残差は、観測値とモデルの予測値の差です。残差に曲がった傾向や扇形の広がりが残っていたら、モデルが捉えていない構造を疑います。正規性の検定だけで解析の妥当性は決まりません。</p></Section>
 <Section title="比較を増やすと、判断も変わる"><p>3案を何通りも比べ、質問項目ごと、属性ごとにも検定して、有意だった結果だけを報告すると、偶然見つかった違いを強調してしまいます。</p><p>検証する比較を先に決めます。比較の集合における誤検出を抑えるHolm法などと、発見した結果の中の誤検出割合を平均的に制御するFDRの考え方は、目的が違います。単に「一番有意になりやすい補正」を選ぶ話ではありません。</p></Section>
 <Section title="予測は、未知のデータで確かめる"><p>学習に使ったデータでの正解率だけでは、実力が分かりません。評価用のデータを分け、モデルづくりに使っていない対象で確かめます。</p><p>標準化や特徴量の選択を全データで済ませてから分割すると、評価側の情報が混ざることがあります。同じ人の測定が学習側と評価側にまたがる場合や、未来の情報を過去の予測に使う場合も要注意です。前処理を含めて、評価の手順を設計します。</p></Section>
 <Prompt text={'次の解析計画を点検してください。問い：【記入】。手法：【記入】。変数・対象数・測定の繰り返し・集団構造：【記入】。説明が目的か予測が目的か：【記入】。独立性、分布・残差、多重共線性、欠測・外れ値、多重比較、過学習・情報漏洩のうち、この計画に関わるものを理由付きで絞ってください。各項目について、何をどう確認し、問題があったらどんな選択肢があるかを説明してください。変数や行を勝手に削除せず、不足情報は先に質問してください。'}/>
 <section className="sources"><h2>詳しく読む</h2><ul><li><a href="https://www.statsmodels.org/stable/generated/statsmodels.stats.outliers_influence.variance_inflation_factor.html">statsmodels：VIF ↗</a></li><li><a href="https://www.statsmodels.org/stable/pitfalls.html">statsmodels：推定時に注意すること ↗</a></li><li><a href="https://www.statsmodels.org/stable/generated/statsmodels.stats.multitest.multipletests.html">statsmodels：多重比較の調整 ↗</a></li><li><a href="https://scikit-learn.org/stable/common_pitfalls.html">scikit-learn：過学習・前処理・情報漏洩 ↗</a></li></ul></section><a className="next-link" href="#/statistics/tools">統計解析を実施する方法を選ぶ →</a>
 </>;}
