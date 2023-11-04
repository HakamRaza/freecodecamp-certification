class Category:

    CATEGORIES = dict()

    def __init__(self, cat):
        self.cat = cat
        self.ledger = []
        self.saldo = 0
        self.CATEGORIES.update(
            {self.cat: 0})

    def __repr__(self):
        self.stampa = f'{self.cat:*^30}\n'

        for x in self.ledger:
            self.stampa += f"{x['description'][:23]:<23}{float(x['amount']):>7.2f}\n" \
                if not isinstance(x['amount'], str) else f"{x['description'][:23]:<23}\n"

        return self.stampa + 'Total: ' + str(self.saldo)

    def get_balance(self):
        return self.saldo

    def check_funds(self, amount):
        if amount > self.saldo:
            return False
        return True

    def deposit(self, dep, description=''):
        self.ledger.append({'amount': dep, 'description': description})
        self.saldo += dep

    def withdraw(self, wtd, description=''):
        if self.check_funds(wtd):
            self.ledger.append({'amount': -wtd, 'description': description})
            self.saldo -= wtd
            self.CATEGORIES[
                self.cat] += wtd

            return True
        return False

    def transfer(self, trf, other):
        if self.check_funds(trf):
            self.ledger.append({
                'amount': -trf,
                'description': f'Transfer to {other.cat}'
            })
            self.saldo -= trf
            self.CATEGORIES[
                self.cat] += trf

            other.ledger.append({
                'amount': trf,
                'description': f'Transfer from {self.cat}'
            })
            other.saldo += trf

            return True
        return False


def create_spend_chart(categories):
    tot = {}
    n = 100

    title = 'Percentage spent by category\n'
    div = '    ' + '---' * len(categories) + '-'

    for item in categories:
        if item.cat in Category.CATEGORIES:
            tot[item.cat] = Category.CATEGORIES[item.cat]

    num = sum(tot.values())

    while n >= 0:
        spc = ''
        for voce in tot:
            spc += ' o ' if int(tot[voce] / num * 100) >= n else '   '
        title += f"{n:>3}|{spc} \n
        n -= 10
    title += div + '\n'

    names_cat = tot.keys()
    max_len = max(names_cat, key=len)

    for i in range(len(max_len))
        spc_str = '    '
        for name in names_cat:
            spc_str += '   ' if i >= len(name) else f' {name[i]} '

        if i != len(max_len)-1
            spc_str += ' \n'

        title += spc_str

    return title + ' '
