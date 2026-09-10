import sys
import pandas as pd
import scipy
from scipy import stats
import matplotlib
import matplotlib.pyplot as plt

df = pd.read_csv("ui_comparison.csv")
print(df.head())
print("行数・列数:", df.shape)
print("欠損数:\n", df.isna().sum())
print("重複した参加者ID:", df["participant_id"].duplicated().sum())

a = df["time_A_sec"]
b = df["time_B_sec"]
assert not df["participant_id"].duplicated().any(), "参加者IDの重複を確認してください"
assert a.notna().all() and b.notna().all(), "欠損の扱いを検討してください"
assert (a >= 0).all() and (b >= 0).all(), "時間の入力を確認してください"
diff = a - b  # 正の値なら、Bの方が短い
print("平均時間 A / B:", a.mean(), b.mean())
print("中央値 A / B:", a.median(), b.median())
print("標本標準偏差 A / B:", a.std(ddof=1), b.std(ddof=1))
print("Bが速い / 遅い / 同じ人数:", (diff > 0).sum(), (diff < 0).sum(), (diff == 0).sum())

fig, axes = plt.subplots(1, 2, figsize=(9, 3.5))
for va, vb in zip(a, b):
    axes[0].plot([0, 1], [va, vb], "o-", alpha=0.6)
axes[0].set(xticks=[0, 1], xticklabels=["A", "B"], ylabel="Time (seconds)", title="Each participant")
axes[1].scatter(range(1, len(diff) + 1), diff)
axes[1].axhline(0, color="gray", linestyle="--")
axes[1].set(xlabel="Participant", ylabel="A - B (seconds)", title="Within-person difference")
plt.tight_layout()
plt.show()

# 練習では、参加者間の独立性と、差の母集団分布の正規性を仮定する
result = stats.ttest_rel(a, b, alternative="two-sided")
ci = result.confidence_interval(confidence_level=0.95)
print(f"平均差 A-B: {diff.mean():.2f} 秒")
print(f"95%信頼区間: {ci.low:.2f} 〜 {ci.high:.2f} 秒")
print(f"t({int(result.df)}) = {result.statistic:.3f}, p = {result.pvalue:.4f}")
print("Python / pandas / SciPy / Matplotlib:", sys.version.split()[0], pd.__version__, scipy.__version__, matplotlib.__version__)
