const q = (key,title,help,options) => ({key,title,help,options:options.map(([value,label])=>({value,label}))});
export const rootQuestion=q('response','説明・予測したい結果（目的変数）はありますか？','目的変数は「何を説明したいか」にあたる値です。例えば、操作時間や購入する／しない。',[['yes','あり：特定の結果を説明・比較・予測したい'],['no','なし：全体の構造や似かたを調べたい'],['unsure','まだ整理できていない']]);
const goal=q('goal','その結果について、何を知りたいですか？','比較も、条件によって目的変数がどう変わるかを調べる問いです。',[['compare','条件・グループの違いを比べたい'],['explain','複数の要因との関係を知りたい'],['predict','新しい対象の結果を予測したい']]);
const outcome=q('outcome','目的変数は、どんな値ですか？','番号を振っただけのカテゴリーと、量として意味のある数字を区別します。',[['numeric','量的な値：操作時間・距離など'],['binary','2種類：成功／失敗、購入する／しない'],['ordinal','順序：5段階評価や順位'],['category','3種類以上のカテゴリー：選んだ製品など'],['count','回数：エラー数、来店回数など'],['unsure','まだ分からない']]);
const dependency=q('dependency','同じ対象から、複数の測定値がありますか？','同じ人の繰り返し測定や、同じクラス内の測定は、互いに独立とは限りません。',[['independent','各対象から1つ。対象間は独立と考えられる'],['repeated','同じ対象を複数条件・時点で測っている'],['clustered','クラス・施設などのまとまりがある'],['unsure','まだ分からない']]);
const groups=q('groups','比べたい条件はいくつありますか？','同じ人がAとBを使うなら2条件。「画面×利用経験」のように要因が複数ある場合も区別します。',[['two','1つの要因で2条件'],['many','1つの要因で3条件以上'],['factorial','要因が複数ある']]);
const exploration=q('exploration','どんな構造を見たいですか？','似ている手法でも、残したい情報や、知りたいことが違います。',[['compress','たくさんの項目を少数の軸・地図にまとめたい'],['latent','複数の質問の背後にある共通の概念を考えたい'],['cluster','似た対象をグループに分けたい'],['association','2つの変数の関係を見たい'],['preference','条件の組み合わせから、好みの要因を知りたい']]);
const format=q('format','データは、どの形ですか？','表の1行と1列が何を表すかを考えて選んでください。',[['numeric','対象ごとに、複数の量的な項目がある'],['category','対象ごとに、複数のカテゴリー回答がある'],['table','2種類のカテゴリーを掛け合わせた度数表'],['distance','対象同士の距離・似ていなさの表'],['mixed','量的な項目とカテゴリーが混在'],['unsure','まだ分からない']]);
const association=q('association','関係を見たい2つの変数は？','ここではどちらか一方を目的変数とせず、関連のしかたを見ます。',[['numeric','両方とも量的な値'],['ordinal','順序尺度を含む'],['category','両方ともカテゴリー'],['mixed','量的な値とカテゴリーの組み合わせ']]);
const preference=q('preference','属性の組み合わせを変えて、選択・評価してもらうデータですか？','例：価格・素材・サイズを組み合わせた製品案から選んでもらう。',[['designed','はい。そのための調査を設計している'],['ordinary','通常の満足度アンケートなど、それ以外'],['unsure','まだ決めていない']]);
const independentPair=q('pairIndependent','観測されたペア同士は独立ですか？','同じ人を何度も測って得たペアを、別々の人のように数えないための確認です。',[['yes','はい。各対象から1組ずつ'],['no','いいえ。同じ対象の繰り返しなどがある'],['unsure','まだ分からない']]);
export function questionsFor(a) {
 const list=[rootQuestion];
 const add=x=>{list.push(x);return Boolean(a[x.key]);};
 if(a.response==='yes') {
  if(!add(goal)||!add(outcome)||a.outcome==='unsure')return list;
  if(!add(dependency)||a.dependency==='unsure')return list;
  if(a.goal==='compare')add(groups);
 } else if(a.response==='no') {
  if(!add(exploration))return list;
  if(a.exploration==='association'){if(add(association))add(independentPair);}
  else if(a.exploration==='preference')add(preference);
  else add(format);
 }
 return list;
}
export function validateAnswers(input){
 if(!input||typeof input!=='object'||Array.isArray(input))throw new Error('回答はオブジェクトで指定してください。');
 const canonical={};
 for(let i=0;i<10;i++) {
  const next=questionsFor(canonical).find(x=>!canonical[x.key]);
  if(!next||input[next.key]===undefined)break;
  if(!next.options.some(x=>x.value===input[next.key]))throw new Error(`無効な選択肢：${next.key}`);
  canonical[next.key]=input[next.key];
 }
 if(Object.keys(input).some(key=>!(key in canonical)))throw new Error('この分岐には含まれない回答、または途中の回答が抜けています。');
 return canonical;
}
export function changeAnswer(a,key,value){
 const kept={};
 for(const question of questionsFor(a)){
  if(question.key===key){kept[key]=value;return validateAnswers(kept);}
  if(a[question.key])kept[question.key]=a[question.key];
 }
 throw new Error('表示されていない質問です。');
}
const candidate=(id,reason,check,variant)=>({id,reason,check,variant});
const result=(intro,...candidates)=>({intro,candidates});
export function recommend(raw){
 const a=validateAnswers(raw), qs=questionsFor(a);
 if(qs.some(x=>!a[x.key]))return result('条件を選ぶと、ここに候補と、その理由が出てきます。');
 if(a.response==='unsure')return result('まず「何を明らかにしたいか」を1文にしてみましょう。「データと変数」で目的変数の例を確認できます。まだ手法を決める必要はありません。');
 if(a.response==='yes') {
  if(a.outcome==='unsure')return result('実際に記録する値の例を3つ書いてみてください。数字の大小や差に意味があるかを整理してから、手法を考えます。');
  if(a.dependency==='unsure')return result('誰を何回測るのか、表の1行が何を表すのかを先に確認しましょう。独立か対応ありかで、選ぶ解析が変わります。');
  const repeated=a.dependency!=='independent';
  if(a.outcome==='count')return result('回数データでは、分布と観測時間を確認してからモデルを選びます。',candidate('regression','回数を説明・予測するなら、ポアソン回帰や負の二項回帰が検討対象です。通常の線形回帰とは、結果の分布の扱いが違います。',`0の多さ、平均と分散の関係、観測時間の違いを確認します。${repeated?'さらに、繰り返し・集団の依存を扱うモデルが必要です。':''}この入門の通常の線形回帰をそのまま適用せず、一般化線形モデルを追加で調べてください。`,'回数を扱う回帰モデル（追加検討）'));
  if(a.goal==='compare') {
   if(a.dependency==='clustered'||a.groups==='factorial')return result('要因や集団の構造をモデルに含めて考えます。',candidate(repeated?'mixed':a.outcome==='numeric'?'anova':'logistic',repeated?'同じ集団・対象の中の依存を扱いながら、条件の違いを検討するためです。':'複数の要因と、その組み合わせによる違いを検討するためです。',`目的変数が${a.outcome==='numeric'?'量的なら、残差や分散の前提を確認します。':'量的な連続値ではないので、通常の分散分析ではなく、二項・順序・多項などの適切な応答分布を持つモデルを検討します。'}条件ごとの人数と、要因の割り当て方を確認してください。`,a.outcome==='numeric'?undefined:'応答の種類に合う一般化モデル（追加検討）'));
   if(a.outcome==='numeric')return a.groups==='two'?result('まずは、平均差の大きさと不確かさを検討します。',candidate(repeated?'paired':'welch',repeated?'同じ対象で2条件を測っているので、一人ひとりの差を使います。':'独立した2群の量的データなので、群間の平均差を比べます。',repeated?'対象間の独立性、差の分布・外れ値、条件の順序を確認します。':'群内の観測の独立性、分布・外れ値、標本の大きさを確認します。')):result('3条件以上を、測り方に合ったモデルで比較します。',candidate('anova',repeated?'同じ対象の3条件以上を比べるため、反復測定の構造を扱う分散分析が候補です。':'独立した3群以上の平均差をまとめて検討するためです。',repeated?'球面性などの前提と、必要な補正を確認します。欠測や不均衡がある場合は混合効果モデルも検討します。':'残差・分散の前提を確認します。等分散が難しければWelch型、事後比較では多重性を考えます。',repeated?'反復測定分散分析':undefined),...(repeated?[candidate('mixed','対象ごとの違いを含めてモデル化できます。','欠測の仕組みやランダム効果の構造は別途判断が必要です。')]:[]));
   if(a.outcome==='binary') {
    if(repeated)return a.groups==='two'?result('同じ人の回答の変化を調べます。',candidate('mcnemar','同じ対象の2条件で、成功／失敗などの二値を記録しているためです。','Aで成功・Bで失敗と、その逆の件数を使います。不一致ペアが少ないときは正確検定を検討します。')):result('繰り返し測定された二値の結果を扱います。',candidate('mixed','同じ人の3条件以上の成功／失敗には、二項分布に対応する混合効果モデルなどが候補になります。','通常の線形混合モデルとは異なります。単純な完全対応の比較ならCochranのQ検定も検討対象です。','二項の混合効果モデルなど（追加検討）'));
    return result('各条件の成功／失敗の内訳を比べます。',candidate('categorical','独立した対象のカテゴリーと条件を、度数表にまとめられるためです。','割合だけでなく件数が必要です。期待度数が小さい場合は、表の大きさに合った正確検定などを検討します。'));
   }
   if(a.outcome==='ordinal')return result('順序を保って比較する手法を検討します。平均差と同じ問いになるとは限りません。',candidate('ranks',repeated?(a.groups==='two'?'対応する回答の上がった／下がったという方向を使う符号検定などが候補です。':'同じ人の3条件以上の順位を使うFriedman検定が候補です。'):(a.groups==='two'?'独立2群の順位を使うMann–WhitneyのU検定が候補です。':'独立3群以上の順位を使うKruskal–Wallis検定が候補です。'),'同順位の多さと、検定が何の違いを調べるかを確認します。Wilcoxon符号付順位検定には、差の大きさを順位づける意味と、差の分布の対称性が必要です。',repeated?(a.groups==='two'?'対応のある順序データ：符号検定など':'Friedman検定'):a.groups==='two'?'Mann–WhitneyのU検定':'Kruskal–Wallis検定'));
   if(a.outcome==='category')return repeated?result('同じ対象による3種類以上のカテゴリー回答は、通常の独立性の検定や二値のMcNemar検定では扱いきれません。周辺同質性の検定や多項の反復測定モデルなどを、表の構造に合わせて追加で検討してください。'):result('選択したカテゴリーと条件の関係を調べます。',candidate('categorical','条件ごとのカテゴリー件数を、度数表として比較するためです。','カテゴリー間の順序の有無と期待度数を確認します。表が疎な場合は別の検定手続きが必要です。'));
  }
  if(a.outcome==='ordinal'||a.outcome==='category')return result('目的変数のカテゴリー構造に合う回帰を追加で検討します。',candidate('logistic',a.outcome==='ordinal'?'順序がある結果には、順序ロジスティック回帰などが候補です。':'3種類以上の結果には、多項ロジスティック回帰などが候補です。',`${a.outcome==='ordinal'?'比例オッズなどの前提':'カテゴリーごとの件数とモデルの前提'}を確認します。${repeated?'繰り返し測定の依存も扱う必要があります。':''}解説の二値モデルをそのまま使わないでください。`,a.outcome==='ordinal'?'順序ロジスティック回帰（追加検討）':'多項ロジスティック回帰（追加検討）'));
  const baseline=repeated?'mixed':a.outcome==='binary'?'logistic':'regression';
  return result(a.goal==='predict'?'まず基準になるモデルをつくり、未知のデータへの予測を比べます。':'ほかの要因をモデルに含めた上で、結果との関係を検討します。',candidate(baseline,repeated?'同じ対象・集団内の依存を考慮するためです。':a.outcome==='binary'?'結果が二値なので、確率をモデル化するためです。':'量的な結果と説明変数の関係をモデル化するためです。',`${a.outcome==='binary'&&repeated?'二項の一般化線形混合モデルを検討します。':''}説明変数の選び方と多重共線性、標本数、モデルの適合を確認します。${a.goal==='predict'?'予測時点で使える情報だけを使い、評価用データを分けます。':'係数を因果効果と解釈するには、研究設計と追加の仮定が必要です。'}`,a.outcome==='binary'&&repeated?'二項の混合効果モデル':undefined),...(a.goal==='predict'?[candidate('forest','曲がった関係や変数の組み合わせも捉える予測モデルとして、基準モデルと比較できます。',repeated?'同じ人や集団が学習側と評価側にまたがらない分割を考えます。森林自体が繰り返しの依存を解消するわけではありません。':'訓練に使ったデータでの精度だけで判断しません。少数例では、複雑なモデルを十分に検証できないことがあります。')]:[]));
 }
 if(a.exploration==='preference')return a.preference==='designed'?result('属性の組み合わせと選好の関係を調べます。',candidate('conjoint','属性を組み合わせた案への選択・評価があるためです。','水準の組み合わせ、提示数、回答者ごとの繰り返しを踏まえて、推定可能な調査を設計します。選択・評定が応答となるので、解析モデルには目的変数が登場します。')):result('通常の満足度調査を、そのままコンジョイント分析のデータにはできません。どの属性をどう組み合わせて提示するか、調査設計から検討しましょう。');
 if(a.exploration==='association'){
  if(a.pairIndependent!=='yes')return result('同じ対象の繰り返しや集団内の依存を整理してから、関係を調べるモデルを考えます。通常の相関の検定や独立性の検定に、すべての行を独立として渡さないでください。');
  return a.association==='mixed'?result('カテゴリーごとに量的な値の分布を描いてみましょう。群間の違いを検討するなら「目的変数あり → 条件の違いを比べたい」で、量的な値を目的変数として整理できます。'):result('2つの変数の関係を見ます。',candidate(a.association==='category'?'categorical':'correlation',a.association==='category'?'カテゴリー同士の件数を掛け合わせ、関連を調べるためです。':a.association==='ordinal'?'順位の単調な関係を調べるSpearmanの順位相関などが候補です。':'散布図で形を見て、直線的な関係ならPearsonの相関係数などで要約できます。','相関・関連は因果関係を意味しません。範囲の制限、外れ値、集団の混在を確認します。'));
 }
 if(a.format==='unsure'||a.format==='mixed')return result(a.format==='mixed'?'量的な値とカテゴリーをそのまま同じ距離やPCAに入れると、比較の意味が崩れることがあります。混合データに対応する距離や手法を選ぶため、各列の種類と調べたい構造をもう一度整理しましょう。':'まず、表の行・列に何が入るか、実例を書いてみましょう。');
 if(a.exploration==='cluster')return ['numeric','category','distance'].includes(a.format)?result('似ている対象をまとめます。',candidate('cluster','目的変数を置かず、対象同士の類似性を使うためです。',a.format==='numeric'?'単位・標準化・距離・グループ数で結果が変わります。クラスターは自然に存在する分類と決まったわけではありません。':a.format==='distance'?'距離行列を受け取れる階層法などを選びます。通常のk-meansに距離行列をそのまま渡す方法とは違います。':'カテゴリー用の距離や手法が必要です。番号を連続量として通常のk-meansへ渡さないでください。')):result('度数表のどちら側を何に基づいてまとめたいのかを先に決めます。対応分析で関係を眺める方法もあります。',candidate('ca','2種類のカテゴリーの度数表の構造を、低次元で捉えるためです。','対応分析はクラスターを決める手法ではありません。距離の意味を確認してから、分類を別途検討します。'));
 if(a.exploration==='latent')return a.format==='numeric'?result('項目に共通する構造をモデルで考えます。',candidate('factor','観測した項目に共通する潜在因子を検討したいためです。','因子の数、標本数、測定の妥当性、項目を連続量として扱う妥当性を確認します。順序回答なら相関・推定方法も検討します。')):result('通常の因子分析を適用する前に、項目の測定尺度を整理してください。順序項目の因子分析や潜在クラス分析など、データの種類に合うモデルは別途検討が必要です。');
 const id={numeric:'pca',category:'mca',table:'ca',distance:'mds'}[a.format];
 return result('データの形に合わせて、情報を少数の軸にまとめます。',candidate(id,{numeric:'複数の量的な項目の分散を、少数の軸で捉えるためです。',category:'複数のカテゴリー項目の回答パターンをまとめるためです。',table:'クロス集計の行と列の関係を、少数の軸で見るためです。',distance:'対象間の距離・非類似度を、点の配置で表すためです。'}[a.format],{numeric:'単位・標準化、寄与率、各項目の重みを確認します。軸の解釈はデータを見て考えます。',category:'少数カテゴリーの影響と、図の距離の解釈を確認します。',table:'人数の大小ではなくプロフィールの関係を読みます。行と列の点の距離は単純には比較できません。',distance:'元の距離が何を表すか、低次元化の誤差がどのくらいかを確認します。'}[a.format]));
}
export function answerSummary(a){return questionsFor(a).filter(q=>a[q.key]).map(q=>`${q.title} → ${q.options.find(o=>o.value===a[q.key]).label}`).join('\n');}
