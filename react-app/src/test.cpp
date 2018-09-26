#include <stdio.h>
#include <bits/stdc++.h>

#define ll long long

using namespace std;

const int N = 1000000;

ll gcd(ll x, ll y)
{
    while (x)
    {
        y %= x;
        swap(x, y);
    }
    return y;
}

ll lcm(ll x, ll y)
{
    return x * y / gcd(x, y);
}

// The area of intersection of rectangles [(x1, y1), (x2, y2)] and [(x3, y3), (x4, y4)]
ll get_intersection(ll x1, ll y1, ll x2, ll y2, ll x3, ll y3, ll x4, ll y4)
{
    ll dx = max(0LL, min(x2, x4) - max(x1, x3) + 1);
    ll dy = max(0LL, min(y2, y4) - max(y1, y3) + 1);
    return dx * dy;
}

string a[N], b[N];
vector<int> sum[N + 1];

/*
sum[i + 1][j + 1] =
b[0][0] + ... + b[0][j]
   +               +
   .               .
   +               +
b[i][0] + ... + b[i][j]
*/
void build_sum(int n, int m)
{
    for (int i = 0; i < n + 1; i++)
    {
        sum[i].resize(m + 1);
        fill(sum[i].begin(), sum[i].begin() + m + 1, 0);
    }
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++)
            sum[i + 1][j + 1] = (b[i][j] - '0');
    for (int i = 0; i < n + 1; i++)
        for (int j = 1; j < m + 1; j++)
            sum[i][j] += sum[i][j - 1];
    for (int i = 1; i < n + 1; i++)
        for (int j = 0; j < m + 1; j++)
            sum[i][j] += sum[i - 1][j];
}

// The sum of values in a rectangle [(x1, y1), (x2, y2)]
int get_cnt(int x1, int y1, int x2, int y2)
{
    return sum[x2 + 1][y2 + 1] - sum[x1][y2 + 1] - sum[x2 + 1][y1] + sum[x1][y1];
}

int main()
{
    ios_base::sync_with_stdio(0);
    cin.tie(0);
    cout.precision(20);
    cout << fixed;
    
    int T;
    cin >> T;
    while (T--)
    {
        string tmp;
        int n1, m1;
        cin >> n1 >> m1;
        cin >> tmp;
        for (int i = 0; i < n1; i++)
            a[i] = tmp.substr(i * m1, m1);
        int n2, m2;
        cin >> n2 >> m2;
        cin >> tmp;
        for (int i = 0; i < n2; i++)
            b[i] = tmp.substr(i * m2, m2);
    
        build_sum(n2, m2);
    
        ll H = lcm(n1, n2), W = lcm(m1, m2);
        ll h1 = H / n1, w1 = W / m1;
        ll h2 = H / n2, w2 = W / m2;
    
        ll ans = 0;
        for (int i = 0; i < n1; i++)
            for (int j = 0; j < m1; j++)
            {
                ll x1 = i * h1, y1 = j * w1;
                ll x2 = x1 + h1 - 1, y2 = y1 + w1 - 1;
                int i1 = x1 / h2, i2 = x2 / h2;
                int j1 = y1 / w2, j2 = y2 / w2;
                
                // We consider the pixel (i,j) from the first photo
                // It corresponds to a rectangle [(x1, y1), (x2, y2)] in the upscaled photo.
    
                // Count corners
                if (a[i][j] == b[i1][j1]) // UL
                    ans += get_intersection(x1, y1, x2, y2, i1 * h2, j1 * w2, i1 * h2 + h2 - 1, j1 * w2 + w2 - 1);
                if (i2 != i1 && a[i][j] == b[i2][j1]) // DL
                    ans += get_intersection(x1, y1, x2, y2, i2 * h2, j1 * w2, i2 * h2 + h2 - 1, j1 * w2 + w2 - 1);
                if (j2 != j1 && a[i][j] == b[i1][j2]) // UR
                    ans += get_intersection(x1, y1, x2, y2, i1 * h2, j2 * w2, i1 * h2 + h2 - 1, j2 * w2 + w2 - 1);
                if (i2 != i1 && j2 != j1 && a[i][j] == b[i2][j2]) // DR
                    ans += get_intersection(x1, y1, x2, y2, i2 * h2, j2 * w2, i2 * h2 + h2 - 1, j2 * w2 + w2 - 1);
    
                // Count sides
                if (j1 + 1 <= j2 - 1) // U
                {
                    int cnt = get_cnt(i1, j1 + 1, i1, j2 - 1);
                    if (a[i][j] == '0')
                        cnt = (j2 - j1 - 1) - cnt;
                    ans += cnt * get_intersection(x1, y1, x2, y2, i1 * h2, (j1 + 1) * w2, i1 * h2 + h2 - 1, (j1 + 1) * w2 + w2 - 1);
                }
                if (i1 + 1 <= i2 - 1) // L
                {
                    int cnt = get_cnt(i1 + 1, j1, i2 - 1, j1);
                    if (a[i][j] == '0')
                        cnt = (i2 - i1 - 1) - cnt;
                    ans += cnt * get_intersection(x1, y1, x2, y2, (i1 + 1) * h2, j1 * w2, (i1 + 1) * h2 + h2 - 1, j1 * w2 + w2 - 1);
                }
                if (j1 + 1 <= j2 - 1 && i1 != i2) // D
                {
                    int cnt = get_cnt(i2, j1 + 1, i2, j2 - 1);
                    if (a[i][j] == '0')
                        cnt = (j2 - j1 - 1) - cnt;
                    ans += cnt * get_intersection(x1, y1, x2, y2, i2 * h2, (j1 + 1) * w2, i2 * h2 + h2 - 1, (j1 + 1) * w2 + w2 - 1);
                }
                if (i1 + 1 <= i2 - 1 && j1 != j2) // R
                {
                    int cnt = get_cnt(i1 + 1, j2, i2 - 1, j2);
                    if (a[i][j] == '0')
                        cnt = (i2 - i1 - 1) - cnt;
                    ans += cnt * get_intersection(x1, y1, x2, y2, (i1 + 1) * h2, j2 * w2, (i1 + 1) * h2 + h2 - 1, j2 * w2 + w2 - 1);
                }
    
                // Count centre
                if (i1 + 1 <= i2 - 1 && j1 + 1 <= j2 - 1)
                {
                    int cnt = get_cnt(i1 + 1, j1 + 1, i2 - 1, j2 - 1);
                    if (a[i][j] == '0')
                        cnt = (i2 - i1 - 1) * (j2 - j1 - 1) - cnt;
                    ans += cnt * get_intersection(x1, y1, x2, y2, (i1 + 1) * h2, (j1 + 1) * w2, (i1 + 1) * h2 + h2 - 1, (j1 + 1) * w2 + w2 - 1);
                }
                
            }
        cout << ans << "\n";
    }
    return 0;
}