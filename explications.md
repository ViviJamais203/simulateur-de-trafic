# Transition fluide entre routes — explications

## Problème initial

Lorsqu'un véhicule atteint la fin d'une route et passe sur la suivante, une animation de traversée d'intersection est jouée. Elle consiste à faire suivre au véhicule un **arc de cercle** reliant sa position de sortie à son point d'entrée sur la route suivante.

Pour construire cet arc, il faut trouver le **centre du cercle**. L'ancienne implémentation utilisait :

```js
function computeArcCenter(p1, dir1, p2, dir2) {
    if (Math.abs(dir1.x) < 0.01) {
        return { x: p2.x, y: p1.y }
    } else {
        return { x: p1.x, y: p2.y }
    }
}
```

Cette formule suppose que les routes sont **soit horizontales, soit verticales** : elle renvoie l'intersection d'une ligne horizontale passant par p1 et d'une ligne verticale passant par p2 (ou l'inverse). Elle fonctionne sur la petite ville (routes axis-alignées), mais produit des arcs totalement incorrects sur le carrefour hexagonal où les routes sont à 0°, 60°, 120°, 180°, 240° et 300°.

## Solution : centre d'arc par intersection de perpendiculaires

### Propriété géométrique utilisée

Un arc de cercle tangent à une direction `dir` en un point `p` a son centre sur la **perpendiculaire à `dir` passant par `p`**.

Donc, pour un arc tangent à `dir1` en `p1` **et** tangent à `dir2` en `p2`, le centre est à l'intersection de :
- la perpendiculaire à `dir1` passant par `p1`
- la perpendiculaire à `dir2` passant par `p2`

### Calcul des perpendiculaires

Pour un vecteur directeur `d = (dx, dy)`, la perpendiculaire est `perp = (-dy, dx)`.

```
perp1 = (-dir1.y,  dir1.x)
perp2 = (-dir2.y,  dir2.x)
```

### Intersection des deux droites

Les deux droites paramétriques sont :

```
Droite 1 : P(t) = p1 + t · perp1
Droite 2 : Q(s) = p2 + s · perp2
```

On cherche t tel que P(t) = Q(s), soit le système :

```
perp1.x · t  −  perp2.x · s  =  p2.x − p1.x   (1)
perp1.y · t  −  perp2.y · s  =  p2.y − p1.y   (2)
```

On résout par la **règle de Cramer** :

```
det = perp2.x · perp1.y  −  perp1.x · perp2.y

t = (−dx · perp2.y  +  perp2.x · dy) / det
```

avec `dx = p2.x − p1.x` et `dy = p2.y − p1.y`.

Le centre du cercle est alors :

```
center = p1 + t · perp1
```

### Lien avec le déterminant et le cas droit

On peut montrer que :

```
det = −(dir1.x · dir2.y − dir1.y · dir2.x) = −(dir1 × dir2)
```

`det = 0` exactement quand `dir1` et `dir2` sont parallèles, c'est-à-dire quand la transition est **rectiligne** (déjà détectée et traitée séparément). Le garde `if (Math.abs(det) < 0.001)` couvre ce cas dégénéré.

### Vérification

Le rayon est identique depuis les deux points :

```
|center − p1|² = t² · (perp1.x² + perp1.y²) = t²  (perp1 est unitaire car dir1 l'est)
|center − p2|² = s² · (perp2.x² + perp2.y²) = s²
```

En résolvant le système on peut vérifier que `|t| = |s|`, garantissant que `p1` et `p2` sont bien sur le même cercle.

### Exemple hexagonal (route 0° → route 60°)

```
p1     ≈ (486.6, 275)    exit direction dir1 = (−1, 0)
p2     ≈ (421.6, 387.5)  entry direction dir2 = (0.5, 0.866)

perp1  = (0, −1)
perp2  = (−0.866, 0.5)

det    = (−0.866)(−1) − (0)(0.5) = 0.866
t      = (−(−64.95)·0.5 + (−0.866)·112.5) / 0.866 = −75

center = (486.6 + 0,  275 + 75) = (486.6, 350)
rayon  = 75
```

Avec l'ancienne formule : center = (486.6, 387.5), rayon depuis p1 = 112.5, rayon depuis p2 = 64.95 → **deux rayons différents**, arc impossible.

## Code final

```js
function computeArcCenter(p1, dir1, p2, dir2) {
    const perp1 = { x: -dir1.y, y: dir1.x }
    const perp2 = { x: -dir2.y, y: dir2.x }

    const dx = p2.x - p1.x
    const dy = p2.y - p1.y

    const det = perp2.x * perp1.y - perp1.x * perp2.y
    if (Math.abs(det) < 0.001) return { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 }

    const t = (-dx * perp2.y + perp2.x * dy) / det

    return {
        x: p1.x + t * perp1.x,
        y: p1.y + t * perp1.y
    }
}
```
