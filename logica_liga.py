# logica_liga.py

def calcular_tabla(lista_equipos, partidos_db):
    """
    Calcula los puntos, goles y ordena la tabla de posiciones.
    """
    # Inicializamos estadísticas para cada equipo
    stats = {e: {"pj": 0, "pg": 0, "pe": 0, "pp": 0, "gf": 0, "gc": 0, "pts": 0} for e in lista_equipos}
    
    for p in partidos_db:
        # Solo procesamos si ambos equipos están en la lista de esta liga
        if p.local in stats and p.visitante in stats:
            stats[p.local]["pj"] += 1
            stats[p.visitante]["pj"] += 1
            stats[p.local]["gf"] += p.goles_local
            stats[p.local]["gc"] += p.goles_visitante
            stats[p.visitante]["gf"] += p.goles_visitante
            stats[p.visitante]["gc"] += p.goles_local
            
            if p.goles_local > p.goles_visitante:
                stats[p.local]["pts"] += 3
                stats[p.local]["pg"] += 1
                stats[p.visitante]["pp"] += 1
            elif p.goles_local < p.goles_visitante:
                stats[p.visitante]["pts"] += 3
                stats[p.visitante]["pg"] += 1
                stats[p.local]["pp"] += 1
            else:
                stats[p.local]["pts"] += 1
                stats[p.visitante]["pts"] += 1
                stats[p.local]["pe"] += 1
                stats[p.visitante]["pe"] += 1

    # Convertimos el diccionario a una lista para ordenarla
    tabla_lista = []
    for nombre, d in stats.items():
        d["nombre"] = nombre
        d["dg"] = d["gf"] - d["gc"]
        tabla_lista.append(d)
    
    # Ordenamos por Puntos, luego Diferencia de Goles, luego Goles a Favor
    return sorted(tabla_lista, key=lambda x: (x["pts"], x["dg"], x["gf"]), reverse=True)

def obtener_resultados_ia(partidos_db, equipos_primera, equipos_humanos):
    """
    Filtra los partidos para mostrar los resultados de la IA debajo de la tabla.
    """
    jornadas = {}
    for p in partidos_db:
        # Solo nos interesan partidos donde ambos son de Primera y NO son humanos
        if p.local in equipos_primera and p.visitante in equipos_primera:
            if p.local not in equipos_humanos and p.visitante not in equipos_humanos:
                if p.jornada not in jornadas:
                    jornadas[p.jornada] = []
                jornadas[p.jornada].append(p)
    return jornadas
